require('dotenv').config();
const mongoose = require('mongoose');
const DailyQuestion = require('../models/DailyQuestion');

async function questionsSeeder() {
  const createQuestionPromises = [];
  await DailyQuestion.deleteMany({});

  const questions = [
    { question: 'Question 1', user_id: 5 },
    { question: 'Question 2', user_id: 5 },
    { question: 'Question 3', user_id: 5 },
    { question: 'Question 4', user_id: 5 },
    { question: 'Question 5', user_id: 5 },
  ];

  questions.forEach(question => {
    createQuestionPromises.push(DailyQuestion.create(question));
  });

  return Promise.all(createQuestionPromises);
}

const closeConnection = () => {
  mongoose.connection.close(() => {
    console.log('Done, mongoose connection disconnected.');
  });
};

async function initSeed() {
  await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

  console.log('***** seeding session instances... *****');
  await questionsSeeder();

  closeConnection();
}

initSeed();
