const { User, toDtos } = require('../models/user');
const {getIds} = require('../util/helper');

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
 * POST /friends/:id
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
 * GET /friends
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
 * GET /friends/request/pending
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
 * GET /friends/request/sent
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
 * POST /friends/request/id/accept
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
 * POST /friends/request/id/decline
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
 *  DELETE /friend/id
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