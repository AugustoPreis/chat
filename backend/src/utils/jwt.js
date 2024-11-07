const jwt = require('jsonwebtoken');
const { isValidString } = require('./validators');

function sign(values) {
  return jwt.sign(values, process.env.JWT_SECRET);
}

function decode(token) {
  if (!isValidString(token)) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { sign, decode };