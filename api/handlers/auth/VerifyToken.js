require('dotenv').config();
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const { generatePolicy } = require('../../helpers/AuthHelpers');

module.exports.auth = (event, context, callback) => {
  // check header or url parameters or post parameters for token
  const token = event.authorizationToken;

  if (!token) return callback(null, 'Unauthorized');
  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return callback(null, 'Unauthorized');
    }
    // if everything is good, save to request for use in other routes
    return callback(null, generatePolicy(decoded.id, 'Allow', event.methodArn));
  });
};
