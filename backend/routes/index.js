const userController = require('./user');
const friendController = require('./friend');
const messageController = require('./message');
const fileController = require('./file');
const verifyToken =  require('../config/auth');

const multer = require('multer');
const upload = multer();
const socketio = require('socket.io');

module.exports = (app, server) => {


  const websocket = socketio().listen(server);
  websocket.on('connection', (socket) => {
    console.log("a user connected");

    socket.on('disconnect', () => {
      console.log('user disconnected');
    })

    socket.on('chat', (msg) => {
      console.log("message: " + msg);
      socket.emit('chat', {msg: "FROM BACK"});

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
