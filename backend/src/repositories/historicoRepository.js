const database = require('../config/database');

async function buscarPorChatUsuario(params) {
  const sql = `
    SELECT
      historico.id,
      historico.tipo,
      historico.descricao,
      historico.data_cadastro "dataCadastro"
    FROM historico
    WHERE historico.usuario = $1
      AND historico.chat = $2
    ORDER BY historico.data_cadastro;
  `;

  return await database.execute(sql, [params.usuario, params.chat]);
}

async function cadastrar(params) {
  const sql = `
    INSERT INTO historico (
      id,
      usuario,
      chat,
      tipo,
      descricao,
      data_cadastro
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
    ) RETURNING id;
  `;

  const result = await database.execute(sql, [
    params.id,
    params.usuarioId,
    params.chatId,
    params.tipo,
    params.descricao,
    params.dataCadastro,
  ]);

  return result[0].id;
}

module.exports = {
  buscarPorChatUsuario,
  cadastrar,
}