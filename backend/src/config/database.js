const pg = require('pg');
const { logger } = require('../utils/logger');
const { isValidString, isValidArray } = require('../utils/validators');

async function connect(exitOnError = false) {
  const client = new pg.Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();

    return client;
  } catch (error) {
    showDatabaseError({ error, connect: true });

    if (exitOnError) {
      process.exit(1);
    } else {
      throw error;
    }
  }
}

async function execute(query, params) {
  const client = await connect();

  try {
    const result = await client.query(query, params);

    await client.end();

    return result.rows;
  } catch (error) {
    showDatabaseError({ error, query, params });

    throw error;
  } finally {
    await client.end();
  }
}

function showDatabaseError(context) {
  const { connect, error, query, params } = context;
  let message = '';

  if (error instanceof Error) {
    message = error.message || '';
  }

  if (isValidString(query)) {
    message += `\nquery: ${query}`;
  }

  if (isValidArray(params)) {
    message += `\nparams: ${JSON.stringify(params)}`;
  }

  if (connect) {
    message = `Erro ao conectar com o banco de dados: ${message}`;
  } else {
    message = `Erro ao executar SQL: ${message}`;
  }

  logger('error', message);
}

module.exports = { connect, execute };