const { Client, Pool } = require('pg');
const { logger } = require('../utils/logger');
const { isValidString, isValidArray } = require('../utils/validators');

async function connect(exitOnError = false) {
  const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
  });

  try {
    const client = await pool.connect();

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

async function execute(query, params, defaultClient) {
  const client = defaultClient || await connect();

  try {
    const result = await client.query(query, params);

    if (!defaultClient) {
      await commit(client, false);
    }

    return result.rows;
  } catch (error) {
    if (!defaultClient) {
      await rollback(client, false);
    }

    showDatabaseError({ error, query, params });

    throw error;
  } finally {
    if (!defaultClient) {
      await client.release();
    }
  }
}

async function commit(client, release = true) {
  if (!client) {
    throw new Error('Pool não informada');
  }

  await client.query('COMMIT');

  if (release) {
    await client.release();
  }
}

async function rollback(client, release = true) {
  if (!client) {
    throw new Error('Pool não informada');
  }

  await client.query('ROLLBACK');

  if (release) {
    await client.release();
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

module.exports = { connect, execute, commit, rollback };