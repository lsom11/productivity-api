const connectToDatabase = require('../db');
const DailyQuestion = require('../models/DailyQuestion');

module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    DailyQuestion.create(JSON.parse(event.body))
      .then(question =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(question),
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
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
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(err) || 'Could not fetch the question.',
        })
      );
  });
};

module.exports.getAll = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    DailyQuestion.find()
      .then(questions =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(questions),
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(err) || 'Could not fetch the questions.',
        })
      );
  });
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
          statusCode: err.statusCode || 500,
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
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(err) || 'Could not remove the question.',
        })
      );
  });
};
