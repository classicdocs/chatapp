const userController = require('./user');
const verifyToken =  require('../config/auth');

module.exports = (app) => {

  app.post('/register', userController.register);
  app.post('/login', userController.login);
  app.get('/me', verifyToken, userController.me);

}
