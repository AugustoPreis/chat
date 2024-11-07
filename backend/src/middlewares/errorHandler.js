const { StatusCodes } = require('http-status-codes');
const { DatabaseError } = require('pg');
const { RequestError } = require('../utils/RequestError');

const DEFAULT_ERROR_MESSAGE = 'Erro ao processar os dados';

function errorHandler(erro, _, res, next) {
  const { code, message } = formatError(erro);

  res.status(code).json({ message });

  next();
}

function formatError(dirt) {
  const error = new RequestError(StatusCodes.INTERNAL_SERVER_ERROR);

  if (dirt instanceof RequestError) {
    return dirt;
  }

  if (dirt instanceof DatabaseError) {
    error.message = dirt.message;
  }

  if (dirt instanceof Error) {
    error.message = dirt.message;

    return error;
  }

  if (typeof dirt === 'string') {
    error.message = dirt.trim();

    return error;
  }

  try {
    error.message = JSON.stringify(dirt);
  } catch {
    error.message = DEFAULT_ERROR_MESSAGE;
  }

  return error;
}

module.exports = { errorHandler, formatError };