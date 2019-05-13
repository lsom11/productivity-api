const User = require('../models/User');

function getUsers() {
  return User.find({})
    .then(users => users)
    .catch(err => Promise.reject(new Error(err)));
}

module.exports = {
  getUsers,
};
