const database = require('../config/database');

async function buscarPorId(login) {
  const query = `
    SELECT
      usuarios.nome,
      usuarios.login,
      usuarios.adm "admin"
    FROM usuarios
    WHERE usuarios.id = $1
      AND usuarios.ativo IS TRUE
  `;
  const result = await database.execute(query, [login]);

  return result[0];
}

async function buscarPorLogin(login) {
  const query = `
    SELECT
      usuarios.id,
      usuarios.nome,
      usuarios.login,
      usuarios.senha,
      usuarios.adm "admin"
    FROM usuarios
    WHERE usuarios.login = $1
      AND usuarios.ativo IS TRUE
  `;
  const result = await database.execute(query, [login]);

  return result[0];
}

async function salvar(context) {
  const query = `
    INSERT INTO usuarios (
      id,
      nome,
      login,
      senha,
      ativo,
      adm
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
    ) RETURNING id;
  `;
  const rows = await database.execute(query, [
    context.id,
    context.nome,
    context.login,
    context.senha,
    context.ativo,
    context.admin,
  ]);

  return rows[0].id;
}

async function atualizar(context) {
  const query = `
    UPDATE usuarios
    SET nome = $2,
      login = $3
      ${context.senha ? ', senha = $4' : ''}
    WHERE id = $1
  `;
  const params = [
    context.id,
    context.nome,
    context.login,
  ];

  if (context.senha) {
    params.push(context.senha);
  }

  const rows = await database.execute(query, params);

  return rows;
}

module.exports = { buscarPorId, buscarPorLogin, salvar, atualizar };