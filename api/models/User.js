const mongoose = require('mongoose');
const Joigoose = require('joigoose')(mongoose, null, {
  _id: true,
  timestamps: true,
});

const Joi = require('joi');

const UserSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  region: Joi.string().optional(),
  configurations: Joi.object()
    .keys({
      features: Joi.object()
        .keys({
          daily_questions: Joi.boolean().required(),
          habit_tracker: Joi.boolean().required(),
          time_tracker: Joi.boolean().required(),
        })
        .required(),
    })
    .optional(),
});

const schema = Joigoose.convert(UserSchema);

schema.updatedAt = { type: Date, default: Date.now };
schema.createdAt = { type: Date, default: Date.now };

module.exports = mongoose.model('User', schema);
