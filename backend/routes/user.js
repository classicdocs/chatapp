var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const User = require('../models/user');
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

