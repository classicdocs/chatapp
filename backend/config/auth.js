const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'] || req.headers['Authorization'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
    
  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;

    next();
  });
}

async function getUserIdFromToken(token) {

  if (!token)
    return null;
    
  let userId = await jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) return null;
    return decoded.id;
  });

  
  return userId;
}

module.exports = {verifyToken, getUserIdFromToken};