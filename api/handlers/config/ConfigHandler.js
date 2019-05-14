const connectToDatabase = require('../../db');
const { me } = require('../../helpers/AuthHelpers');
const englishText = require('../../config/english.json');
const portugueseText = require('../../config/portuguese.json');

module.exports.text = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // TODO - CHANGE SESSION TO DEVICE INFO AND REMOVE AUTH FROM SERVERLESS
  connectToDatabase()
    .then(() => me(event.requestContext.authorizer.principalId))
    .then(session => {
      let text;
      if (session.region == 'pt-BR') text = portugueseText;
      else text = englishText;

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(text),
      });
    })
    .catch(err =>
      callback(null, {
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(err) || 'Could not fetch app region info.',
      })
    );
};

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
