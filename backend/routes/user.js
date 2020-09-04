var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const mongoose = require('mongoose');
const { User, toDtos, toDto } = require('../models/user');
const validator = require('validator');
const validateParams = require('../util/validator');
const { Message } = require('../models/message');

/**
 * POST /login
 * Sign in using email and password.
 */
exports.login = (req, res, next) => {

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, config.SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });
};

/**
 * POST /register
 * Sign up.
 */
exports.register = (req, res, next) => {

  const { email, password, firstName, lastName } = req.body;

  validateParams({ email, password, firstName, lastName }, res);

  let validationErrors = [];
  if (!validator.isEmail(email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(password)) validationErrors.push({ msg: 'Password cannot be blank.' });
  if (firstName && validator.isEmpty(firstName)) validationErrors.push({ msg: 'First name cannot be blank.' });
  if (lastName && validator.isEmpty(lastName)) validationErrors.push({ msg: 'Last name cannot be blank.' });

  if (validationErrors.length) {
    res.status(400).send(validationErrors);
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  User.create({ email, firstName, lastName, password: hashedPassword }, (err, user) => {
    if (err) return res.status(500).send("There was a problem registering the user.")
    // create a token
    res.status(200).send("Successfully registered!");
  });
};

/**
 * GET /me
 * Get current user information
 */
exports.me = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['Authorization'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    User.findById(req.userId, { password: 0 }, (err, user) => {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");

      res.status(200).send(user);
    });
  });
}


/**
 * GET /user/search
 * Search users
 */
exports.searchUsers = (req, res, next) => {

  const firstName = req.query.firstName ? req.query.firstName : "";
  const lastName = req.query.lastName ? req.query.lastName : "";

  User.find({ firstName: new RegExp(firstName, 'i'), lastName: new RegExp(lastName, 'i') }, (err, users) => {
    if (err) return res.status(500).send('Error on the server.');

    return res.status(200).send(toDtos(users));
  });
}


/**
 * POST /user/friends/:id
 * Add friend
 */
exports.addFriend = (req, res, next) => {

  const friendId = req.params.id;
  const userId = req.userId;


  if (!friendId) {
    return res.status(400).send();
  }

  User.findById(friendId, (err, friend) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!friend) return res.status(404).send("User not found");

    User.findById(userId, (err, user) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send("User not found");

      if (isMyFriend(friendId, user)) {
        return res.status(400).send("User is already your friend");
      }

      friend.pendingFriendRequests.push(userId);
      friend.save();

      user.sentFriendRequests.push(friendId);
      user.save();

      return res.status(200).send("User successfully added");

    })
  });
}

/**
 * GET /user/friends
 * Get friends
 */
exports.getFriends = (req, res, next) => {

  const userId = req.userId;

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");

    let ids = getIds(user.friends);

    User.find({ '_id': { $in: ids } }, (err, users) => {
      if (err) return res.status(500).send('Error on the server.');
      res.status(200).send(toDtos(users));
    })
  })
}

/**
 * GET /user/friends/request/pending
 * Get pending friends request
 */
exports.pendingFriendRequests = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");

    let ids = getIds(user.pendingFriendRequests);

    User.find({ '_id': { $in: ids } }, (err, users) => {
      if (err) return res.status(500).send('Error on the server.');
      res.status(200).send(toDtos(users));
    })
  })
}

/**
 * GET /user/friends/request/sent
 * Get sent friend requests
 */
exports.sentFriendRequests = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");

    let ids = getIds(user.sentFriendRequests);

    User.find({ '_id': { $in: ids } }, (err, users) => {
      if (err) return res.status(500).send('Error on the server.');
      res.status(200).send(toDtos(users));
    })
  })
}

/**
 * POST /user/friends/request/id/accept
 * Accept friends request
 */
exports.acceptFriendRequest = (req, res, next) => {
  const userId = req.userId;
  const friendId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");

    if (!user.pendingFriendRequests.includes(friendId)) {
      return res.status(404).send("Friend request not found");
    }

    user.pendingFriendRequests = user.pendingFriendRequests.filter(id => id != friendId);
    user.friends.push(friendId);

    User.findById(friendId, (err, friend) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!friend) return res.status(404).send("User not found");

      if (!friend.sentFriendRequests.includes(userId)) {
        return res.status(404).send("Friend request not found");
      }

      friend.sentFriendRequests = friend.sentFriendRequests.filter(id => id != userId);
      friend.friends.push(userId);

      user.save();
      friend.save();

      return res.status(200).send("Friend request successfully accepted!");

    })
  })
}

/**
 * POST /user/friends/request/id/decline
 * Decline friends request
 */
exports.declineFriendRequest = (req, res, next) => {
  const userId = req.userId;
  const friendId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");


    if (!user.pendingFriendRequests.includes(friendId)) {
      return res.status(404).send("Friend request not found");
    }

    user.pendingFriendRequests = user.pendingFriendRequests.filter(id => id != friendId);

    User.findById(friendId, (err, friend) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!friend) return res.status(404).send("User not found");

      if (!friend.sentFriendRequests.includes(userId)) {
        return res.status(404).send("Friend request not found");
      }

      friend.sentFriendRequests = friend.sentFriendRequests.filter(id => id != userId);

      user.save();
      friend.save();

      return res.status(200).send("Friend request successfully declined!");

    })
  })
}


/**
 *  DELETE /user/friend/id
 */
exports.deleteFriend = (req, res, next) => {
  const userId = req.userId;
  const friendId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");

    if (!user.friends.includes(friendId)) {
      return res.status(404).send("User is not your friend");
    }

    user.friends = user.friends.filter(id => id != friendId);

    User.findById(friendId, (err, friend) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!friend) return res.status(404).send("User not found");

      if (!friend.friends.includes(userId)) {
        return res.status(404).send("User is not your friend");
      }

      friend.friends = friend.friends.filter(id => id != userId);

      user.save();
      friend.save();

      return res.status(200).send("Friend successfully removed!");

    })
  })
}

/**
 * GET /user/inbox
 * Get user inbox
 */
exports.getInbox = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId, async (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");

    let ids = getIds(user.inbox);

    let data = [];

    for (const friendId of ids) {

      const friend = await User.findById(friendId, (err) => {
        if (err) return res.status(500).send('err');
      });

      if (!friend) {
        return res.status(404).send("User not found");
      }

      const msg = await Message.findOne({ $or: [{ from: userId }, { to: userId }] }, (err) => {
        if (err) return res.status(500).send('err');
      }).sort({ createdAt: -1 });

      if (!msg) {
        return;
      }

      data.push({
        friend: toDto(friend),
        msg
      });
    }

    return res.status(200).send(data);
  })

}

/**
 * GET /user/inbox/id
 * Get user chat with friend
 */
exports.getSingleChat = (req, res, next) => {
  const userId = req.userId;
  const friendId = req.params.id;

  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    size: parseInt(req.query.size, 10) || 10
  }

  User.findById(userId, async (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");


    Message.find({ $or: [{ from: userId, to: friendId }, { from: friendId, to: userId }] }, (err, msgs) => {
      if (err) return res.status(500).send("Error on the server.");

      return res.status(200).send(msgs);

    })
    .sort({createdAt: -1})
    .skip(pageOptions.page * pageOptions.size)
    .limit(pageOptions.limit);

  })

}

/**
 * POST /user/message
 * Send message
 */
exports.sendMessage = (req, res, next) => {
  const userId = req.userId;

  let {friendId, message} = req.body;

  validateParams({friendId, message}, res);


  User.findById(userId, async (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");

    if (!user.inbox.includes(friendId)) {
      user.inbox.push(friendId);
    }

    User.findById(friendId, async (err, friend) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send("User not found");
  
      if (!friend.inbox.includes(userId)) {
        friend.inbox.push(userId);
      }
  

      user.save();
      friend.save();
      
      let msg = new Message({from: userId, to: friendId, value: message});
      msg.save();
  
      return res.status(200).send(msg);
    })


  })

}


function getIds(ids) {
  return ids.map(id => mongoose.Types.ObjectId(id));
}

function isMyFriend(friendId, user) {

  let isFriend = false;

  user.friends.forEach(id => {
    if (id === friendId) {
      isFriend = true;
    }
  });

  user.pendingFriendRequests.forEach(id => {
    if (id === friendId) {
      isFriend = true;
    }
  });

  user.sentFriendRequests.forEach(id => {
    if (id === friendId) {
      isFriend = true;
    }
  });

  return isFriend;

}