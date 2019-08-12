require('dotenv').config();

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let isConnected;

const connectToDatabase = () => {
  if (isConnected) {
    console.log('=> using existing database connection' + isConnected);
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  return mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(db => {
      isConnected = db.connections[0].readyState;
    });
};

module.exports = connectToDatabase;
