const userController = require('./user');
const friendController = require('./friend');
const messageController = require('./message');
const fileController = require('./file');
const { verifyToken, getUserIdFromToken } = require('../config/auth');
const { User } = require('../models/user');
const multer = require('multer');
const upload = multer();
const socketio = require('socket.io');
const mongoose = require('mongoose');
const redis = require("redis");

const APPID = process.env.APPID;

// list of sockets
global.connections = [];

global.subscriber = redis.createClient({
  port: 6379,
  host: 'rds'
});

global.publisher = redis.createClient({
  port: 6379,
  host: 'rds'
});

module.exports = (app, server) => {


  subscriber.on("subscribe", function (channel, count) {
    console.log(`SUBSCRIBE`);
  });

  subscriber.on("message", async function (channel, message) {

    message = JSON.parse(message);

    let socketIds = [];

    await User.find({
      '_id': {
        $in: [
          mongoose.Types.ObjectId(message.from),
          mongoose.Types.ObjectId(message.to)
        ]
      }
    }, (err, users) => {

      socketIds = users.map(u => u.socketId || null);
    })

    connections.forEach(socket => {

      socketIds.forEach(id => {
        if (socket.id == id) {
          socket.emit('message', message);
        }
      });
    });
  });

  subscriber.subscribe("chat");

  const websocket = socketio().listen(server);

  websocket.use(async (socket, next) => {
    let token = socket.handshake.query.token;


    let userId = await getUserIdFromToken(token);

    if (userId) {
      socket.handshake.query.userId = userId;
      return next();
    }

    return next(new Error('authentication error'));
  })

  websocket.on('connection', async socket => {

    let userId = socket.handshake.query.userId;

    connections.push(socket);
    console.log(`${socket.id} + " connected!`);

    console.log('Number of connections: ' + connections.length);


    await User.findByIdAndUpdate(userId, { socketId: socket.id });

    socket.on('disconnect', () => {

      connections = connections.filter(s => s.id != socket.id);

      console.log(`${socket.id} + " disconnected`);
      console.log('Number of connections: ' + connections.length);
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
