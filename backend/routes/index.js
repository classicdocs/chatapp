const userController = require('./user');
const verifyToken =  require('../config/auth');

module.exports = (app) => {

  app.post('/api/register', userController.register);
  app.post('/api/login', userController.login);
  app.get('/api/me', verifyToken, userController.me);
  app.get('/api/user/search', verifyToken, userController.searchUsers);
  app.post('/api/user/friends/:id', verifyToken, userController.addFriend);
  app.get('/api/user/friends', verifyToken, userController.getFriends);
}
