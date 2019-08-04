// UserHandler.js
const DailyQuestion = require('../models/DailyQuestion');
const { me } = require('../helpers/AuthHelpers');

const connectToDatabase = require('../db');

const { getUsers } = require('../helpers/UserHelpers');

module.exports.getUsers = (event, context) => {
  console.log(event);
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(getUsers)
    .then(users => ({
      statusCode: 200,
      body: JSON.stringify(users),
    }))
    .catch(err => ({
      statusCode: err.statusCode || 404,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: err.message }),
    }));
};

module.exports.getQuestionsByUserId = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => me(event.requestContext.authorizer.principalId))
    .then(session =>
      DailyQuestion.find({ user_id: session._id }).then(questions => ({
        statusCode: 200,
        body: JSON.stringify(questions),
      }))
    )
    .catch(err => ({
      statusCode: err.statusCode || 404,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message },
    }));
};
