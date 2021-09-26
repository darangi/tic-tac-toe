/* eslint-disable prefer-destructuring */
const Joi = require('joi');

const generateId = () => Math.random().toString(36).substring(2, 15)
 + Math.random().toString(36).substring(2, 15);

const validateRequest = (fields) => {
  const schema = Joi.object({
    player: Joi.string().required(),
    matchId: Joi.any().required(),
    row: Joi.number().required(),
    column: Joi.number().required(),
  });
  const { error } = schema.validate(fields);

  return error ? error.details.map(({ message }) => message).join(', ') : false;
};

module.exports = {
  generateId,
  validateRequest,
};
