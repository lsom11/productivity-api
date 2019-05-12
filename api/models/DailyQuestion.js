const mongoose = require('mongoose');
const Joigoose = require('joigoose')(mongoose, null, {
  _id: true,
  timestamps: true,
});

const Joi = require('joi');

const DailyQuestionSchema = Joi.object().keys({
  question: Joi.string().required(),
  answer: Joi.string().optional(),
  user_id: Joi.string().optional(),
});

const schema = Joigoose.convert(DailyQuestionSchema);

schema.updatedAt = { type: Date, default: Date.now };
schema.createdAt = { type: Date, default: Date.now };

module.exports = mongoose.model('DailyQuestion', schema);
