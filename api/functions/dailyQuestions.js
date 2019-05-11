module.exports.test = (event, context, callback) => {
  console.log(event, 'here');
  return 'hello';
};

module.exports.add = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully! POST',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.get = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully! GET',
      input: event,
    }),
  };

  callback(null, response);
};
