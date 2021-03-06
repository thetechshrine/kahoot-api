const { Answer } = require('../models/answer');
const { Question } = require('../models/question');

const { BadRequestError } = require('../utils/errors');

const checkExistingPosition = async (questionId, { position }) => {
  const existingAnswer = await Answer.findOne({
    question: questionId,
    position
  });
  if (existingAnswer)
    throw new BadRequestError(
      `There is already an answer at postion ${position}`
    );
};

const checkPosition = ({ position }) => {
  if (position && (position < 1 || position > 4)) {
    throw new BadRequestError(`Answer position must be between 1 and 4`);
  }
};

const createAnswer = async (questionId, params) => {
  await checkExistingPosition(questionId, params);

  const answer = new Answer({
    ...params,
    question: questionId
  });

  await answer.save();
  await Question.updateOne(
    {
      _id: questionId
    },
    { $push: { answers: answer._id } }
  );

  return answer;
};

const getAnswer = async answerId => {
  const answer = Answer.findById(answerId);
  return answer;
};

const updateAnswer = async (answerId, params) => {
  const answer = await getAnswer(answerId);

  checkPosition(params);

  Object.assign(answer, params);
  await answer.save();

  return answer;
};

const deleteAnswer = async ({ questionId, answerId }) => {
  await Question.updateOne(
    {
      _id: questionId
    },
    { $pull: { answers: answerId } }
  );
  await Answer.deleteOne({ _id: answerId });
};

module.exports = {
  createAnswer,
  updateAnswer,
  deleteAnswer
};
