const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: mongoose.Types.ObjectId,
  to: mongoose.Types.ObjectId,
  value: String
}, {timestamps: true});


const Message = mongoose.model('Message', MessageSchema, 'messages');

module.exports = {Message};

