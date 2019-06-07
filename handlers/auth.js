require('dotenv').config();

// AuthHandler.js

const connectToDatabase = require('../db');

const { me, login, register } = require('../helpers/AuthHelpers');

module.exports.login = (event, context) => {
  console.log('login!');
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => login(JSON.parse(event.body)))
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session),
    }))
    .catch(err => ({
      statusCode: err.statusCode || 404,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message },
    }));
};

module.exports.register = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => register(JSON.parse(event.body)))
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session),
    }))
    .catch(err => ({
      statusCode: err.statusCode || 404,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message,
    }));
};

module.exports.me = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(
      () => me(event.requestContext.authorizer.principalId) // the decoded.id from the VerifyToken.auth will be passed along as the principalId under the authorizer
    )
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session),
    }))
    .catch(err => ({
      statusCode: err.statusCode || 404,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message },
    }));
};
