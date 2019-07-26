const connectToDatabase = require('../db');
const DailyQuestion = require('../models/DailyQuestion');
const { me } = require('../helpers/AuthHelpers');

module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(
      () => me(event.requestContext.authorizer.principalId) // the decoded.id from the VerifyToken.auth will be passed along as the principalId under the authorizer
    )
    .then(session => {
      const body = JSON.parse(event.body);
      console.log(body, 'here body');
      body.user_id = session._id;

      DailyQuestion.create(body)
        .then(question =>
          callback(null, {
            statusCode: 200,
            body: JSON.stringify(question),
          })
        )
        .catch(err =>
          callback(null, {
            statusCode: err.statusCode || 404,
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(err) || 'Could not create the question.',
          })
        );
    });
};

module.exports.getOne = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    DailyQuestion.findById(event.pathParameters.id)
      .then(question =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(question),
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 404,
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(err) || 'Could not fetch the question.',
        })
      );
  });
};

module.exports.getAll = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      DailyQuestion.find().then(questions => ({
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

module.exports.getAllWithId = (event, context, callback) => {
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

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    DailyQuestion.findByIdAndUpdate(
      event.pathParameters.id,
      JSON.parse(event.body),
      { new: true }
    )
      .then(question =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(question),
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 404,
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(err) || 'Could not update the question.',
        })
      );
  });
};

module.exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    DailyQuestion.findByIdAndRemove(event.pathParameters.id)
      .then(question =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: `Removed question with id: ${question._id}`,
            question,
          }),
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 404,
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(err) || 'Could not remove the question.',
        })
      );
  });
};
