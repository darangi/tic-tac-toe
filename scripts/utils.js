/* eslint-disable prefer-destructuring */
const generateId = () => Math.random().toString(36).substring(2, 15)
 + Math.random().toString(36).substring(2, 15);

const validateRequest = (requiredFields, expectedFields) => {
  const result = requiredFields.filter((field) => !expectedFields.includes(field));

  return result.join(', ');
};

module.exports = {
  generateId,
  validateRequest,
};
