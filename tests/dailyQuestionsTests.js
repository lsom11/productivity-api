const chai = require('chai');
const dailyQuestions = require('../api/functions/dailyQuestions');

const { test } = dailyQuestions;
const { expect } = chai;

describe('test', () => {
  it('should add the params together', () => {
    expect(test(2, 2)).to.equal(4);
  });
});
