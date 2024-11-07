function isString(value) {
  return typeof value === 'string';
}

function isValidString(value) {
  return isString(value) && value.trim() !== '';
}

function isNumber(value) {
  return typeof value === 'number';
}

function isValidNumber(value) {
  return isNumber(value) && !isNaN(value) && isFinite(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isValidArray(value) {
  return isArray(value) && value.length > 0;
}

function isDate(value) {
  return value instanceof Date;
}

function isValidDate(value) {
  return isDate(value) && !isNaN(value.getTime());
}

function isValidUUID(value) {
  if (!isString(value)) {
    return false;
  }

  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

  return uuidRegex.test(value);
}

module.exports = {
  //string
  isString,
  isValidString,

  //number
  isNumber,
  isValidNumber,

  //array
  isArray,
  isValidArray,

  //date
  isDate,
  isValidDate,

  //UUID
  isValidUUID,
}