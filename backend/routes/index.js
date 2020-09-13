const userController = require('./user');
const friendController = require('./friend');
const messageController = require('./message');
const fileController = require('./file');
const verifyToken =  require('../config/auth');

const multer = require('multer');
const upload = multer();
const socketio = require('socket.io');

const redis =  require("redis");

// list of sockets
let connections = [];
  
global.subscriber = redis.createClient({
  port      : 6379,              
  host      : 'localhost'} );

global.publisher = redis.createClient({
  port      : 6379,              
  host      : 'localhost'} );

module.exports = (app, server) => {

  
  subscriber.on("subscribe", function(channel, count) {
    console.log(`SUBSCRIBE`);
  });
    
  subscriber.on("message", function(channel, message) {

    console.log("channel: " + channel + " , message " + message);
  
  });

  subscriber.subscribe("chat");

  const websocket = socketio().listen(server);

  websocket.on('connection', socket => {
    console.log("connection");

    connections.push(socket);

    // save socket id to user

    

    socket.on('disconnect', () => {
      console.log("User disconnected")

      connections = connections.filter(socket => socket.id != socket.id);
    })
  })

  app.post('/api/login', userController.login);
  app.post('/api/register', userController.register);
  app.get('/api/me', verifyToken, userController.me);
  app.get('/api/friends/search', verifyToken, friendController.searchUsers);
  app.post('/api/friends/:id', verifyToken, friendController.addFriend);
  app.get('/api/friends', verifyToken, friendController.getFriends);
  app.get('/api/friends/request/pending', verifyToken, friendController.pendingFriendRequests);
  app.get('/api/friends/request/sent', verifyToken, friendController.sentFriendRequests);
  app.put('/api/friends/request/:id/accept', verifyToken, friendController.acceptFriendRequest);
  app.put('/api/friends/request/:id/decline', verifyToken, friendController.declineFriendRequest);
  app.put('/api/friends/request/:id/cancel', verifyToken, friendController.cancelFriendRequest);
  app.delete('/api/friends/:id', verifyToken, friendController.deleteFriend);
  app.get('/api/friends/:id', verifyToken, friendController.getFriend);
  app.get('/api/inbox', verifyToken, messageController.getInbox);
  app.get('/api/inbox/:id', verifyToken, messageController.getSingleChat);
  app.post('/api/inbox/message', verifyToken, messageController.sendMessage);
  app.post('/api/upload', upload.single('file'), verifyToken, fileController.uploadFile);
}
