// AuthHandler.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');
const User = require('../models/User');

/*
 * Helpers
 */
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 86400, // expires in 24 hours
  });
}

function validateEmail(email) {
  const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (regex.test(email)) return true;
  return false;
}

function checkIfInputIsValid(eventBody) {
  if (!(eventBody.password && eventBody.password.length >= 7)) {
    return Promise.reject(
      new Error(
        'Password error. Password needs to be longer than 8 characters.'
      )
    );
  }

  if (
    !(
      eventBody.username &&
      eventBody.username.length > 5 &&
      typeof eventBody.username === 'string'
    )
  )
    return Promise.reject(
      new Error('Username error. Username needs to longer than 5 characters')
    );

  if (
    (!eventBody.email || !validateEmail(eventBody.email)) &&
    typeof eventBody.username === 'string'
  )
    return Promise.reject(
      new Error('Email error. Email must have valid characters.')
    );

  return Promise.resolve();
}

function register(eventBody) {
  return checkIfInputIsValid(eventBody) // validate input
    .then(
      () =>
        User.findOne({
          $or: [{ email: eventBody.email }, { username: eventBody.username }],
        }) // check if user exists
    )
    .then(
      user =>
        user
          ? Promise.reject(
              new Error('User with that email or username already exists.')
            )
          : bcrypt.hash(eventBody.password, 8) // hash the pass
    )
    .then(
      hash =>
        User.create({
          username: eventBody.username,
          email: eventBody.email,
          password: hash,
          firstName: eventBody.firstName,
          lastName: eventBody.lastName,
          region: eventBody.region || 'en-US',
          configurations: {
            features: {
              daily_questions: true,
              habit_tracker: true,
              time_tracker: true,
            },
          },
        })
      // create the new user
    )
    .then(user => ({ auth: true, token: signToken(user._id) }));
  // sign the token and send it back
}

function comparePassword(eventPassword, userPassword, userId) {
  return bcrypt
    .compare(eventPassword, userPassword)
    .then(passwordIsValid =>
      !passwordIsValid
        ? Promise.reject(new Error('The credentials do not match.'))
        : signToken(userId)
    );
}

function login(eventBody) {
  return User.findOne({
    $or: [{ email: eventBody.email }, { username: eventBody.username }],
  })
    .then(user =>
      !user
        ? Promise.reject(new Error('User with that email does not exits.'))
        : comparePassword(eventBody.password, user.password, user._id)
    )
    .then(token => ({ auth: true, token }));
}

function me(userId) {
  return User.findById(userId, { password: 0 })
    .then(user => (!user ? Promise.reject('No user found.') : user))
    .catch(err => Promise.reject(new Error(err)));
}

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports = {
  me,
  login,
  generatePolicy,
  register,
};
