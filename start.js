require('@babel/register')({});
require('dotenv').config();

// Import the rest of our application.
module.exports = require('./index.js');
