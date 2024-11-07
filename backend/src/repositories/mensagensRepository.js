const database = require('../config/database');

async function buscarPorId(id) {
  const sql = `
    SELECT
      json_build_object(
        'id', usuarios.id,
        'nome', usuarios.nome
      ) "usuario",
      mensagens.descricao,
      mensagens.data_cadastro "dataCadastro"
    FROM mensagens
      INNER JOIN usuarios ON usuarios.id = mensagens.usuario
    WHERE mensagens.id = $1
  `;
  const result = await database.execute(sql, [id]);

  return result[0];
}

async function buscarMensagensAnteriores(data) {
  const sql = `
    SELECT
      mensagens.id,
      json_build_object(
        'id', usuarios.id,
        'nome', usuarios.nome
      ) "usuario",
      mensagens.descricao,
      mensagens.data_cadastro "dataCadastro"
    FROM mensagens
      INNER JOIN usuarios ON usuarios.id = mensagens.usuario
    WHERE mensagens.data_cadastro <= $1
      AND mensagens.ativo IS TRUE
    ORDER BY mensagens.data_cadastro;
  `;

  return await database.execute(sql, [data]);
}

async function cadastrar(params) {
  const sql = `
    INSERT INTO mensagens (
      id,
      usuario,
      chat,
      descricao,
      data_cadastro
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5
    ) RETURNING id;
  `;
  const result = await database.execute(sql, [
    params.id,
    params.usuarioId,
    params.chatId,
    params.descricao,
    params.dataCadastro,
  ]);

  return result[0].id;
}

module.exports = {
  buscarPorId,
  buscarMensagensAnteriores,
  cadastrar,
};