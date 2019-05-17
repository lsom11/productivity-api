const connectToDatabase = require('../../db');
const { me } = require('../../helpers/AuthHelpers');

module.exports.features = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => me(event.requestContext.authorizer.principalId))
    .then(session =>
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(session.configurations.features),
      })
    )
    .catch(err =>
      callback(null, {
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(err) || 'Could not fetch user features.',
      })
    );
};

module.exports.poc = (event, context, callback) =>
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
  });
