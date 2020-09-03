const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  password: String,
  friends: [],
  sentFriendRequests: [],
  pendingFriendRequests: []
}, {timestamps: true});


const User = mongoose.model('User', UserSchema, 'users');

function toDto(user) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  }
}

function toDtos(users) {
  return users.map(user => toDto(user));
}

module.exports = {User, toDtos};

