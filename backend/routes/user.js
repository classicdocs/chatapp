var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const mongoose = require('mongoose');
const {User, toDtos} = require('../models/user');
const validator = require('validator');
const validateParams = require('../util/validator');

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

  const {email, password, firstName, lastName} = req.body;
  
  validateParams({email, password, firstName, lastName}, res);

  let validationErrors = [];
  if (!validator.isEmail(email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(password)) validationErrors.push({ msg: 'Password cannot be blank.' });
  if (firstName && validator.isEmpty(firstName)) validationErrors.push({ msg: 'First name cannot be blank.' });
  if (lastName && validator.isEmpty(lastName)) validationErrors.push({ msg: 'Last name cannot be blank.' });

  if (validationErrors.length) {
    res.status(400).send(validationErrors);
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  User.create({email, firstName, lastName, password : hashedPassword}, (err, user) => {
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

    User.find({'_id': {$in: ids}}, (err, users) => {
      if (err) return res.status(500).send('Error on the server.');
      console.log(users);
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

    User.find({'_id': {$in: ids}}, (err, users) => {
      if (err) return res.status(500).send('Error on the server.');
      console.log(users);
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

    User.find({'_id': {$in: ids}}, (err, users) => {
      if (err) return res.status(500).send('Error on the server.');
      console.log(users);
      res.status(200).send(toDtos(users));
    })
  })
}

function getIds(ids) {
  return ids.map(id => mongoose.Types.ObjectId(id));
}

async function isMyFriend(friendId, user) {

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