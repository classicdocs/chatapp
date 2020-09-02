const userController = require('./user');
const verifyToken =  require('../config/auth');

module.exports = (app) => {

  app.post('/api/register', userController.register);
  app.post('/api/login', userController.login);
  app.get('/api/me', verifyToken, userController.me);
}
