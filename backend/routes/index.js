const userController = require('./user');
const verifyToken =  require('../config/auth');

module.exports = (app) => {

  app.post('/api/register', userController.register);
  app.post('/api/login', userController.login);
  app.get('/api/me', verifyToken, userController.me);
  app.get('/api/user/search', verifyToken, userController.searchUsers);
  app.post('/api/user/friends/:id', verifyToken, userController.addFriend);
  app.get('/api/user/friends', verifyToken, userController.getFriends);
  app.get('/api/user/friends/request/pending', verifyToken, userController.pendingFriendRequests);
  app.get('/api/user/friends/request/sent', verifyToken, userController.sentFriendRequests);
  app.put('/api/user/friends/request/:id/accept', verifyToken, userController.acceptFriendRequest);
  app.put('/api/user/friends/request/:id/decline', verifyToken, userController.declineFriendRequest);
  app.delete('/api/user/friends/:id', verifyToken, userController.deleteFriend);
  app.get('/api/user/inbox', verifyToken, userController.getInbox);
}
