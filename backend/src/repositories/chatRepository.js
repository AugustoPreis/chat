const database = require('../config/database');

async function listar(filtro) {
  const sql = `
    SELECT
      chats.id,
      chats.nome,
      chats.qtd_maxima_usuarios "qtdMaximaUsuarios",
      chats.qtd_usuarios_ativos "qtdAtualUsuarios"
    FROM chats
    WHERE chats.privado IS FALSE
      AND chats.qtd_usuarios_ativos > 0
      AND chats.nome ILIKE '%'||$1||'%'
    ORDER BY chats.nome, chats.qtd_usuarios_ativos DESC;
  `;

  return await database.execute(sql, [filtro]);
}

async function buscarPorId(id) {
  const sql = `
    SELECT
      json_build_object(
        'id', usuarios.id,
        'nome', usuarios.nome
      ) "criador",
      chats.nome,
      chats.privado,
      chats.qtd_maxima_usuarios "qtdMaximaUsuarios",
      chats.qtd_usuarios_ativos "qtdAtualUsuarios"
    FROM chats
      INNER JOIN usuarios ON usuarios.id = chats.criador
    WHERE chats.id = $1
  `;

  const result = await database.execute(sql, [id]);

  return result[0];
}

async function cadastrar(params) {
  const sql = `
    INSERT INTO chats (
      id,
      criador,
      nome,
      qtd_usuarios_ativos,
      qtd_maxima_usuarios,
      privado
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
    params.nome,
    params.qtdUsuariosAtivos,
    params.qtdMaximaUsuarios,
    params.privado,
  ]);

  return result[0].id;
}

async function qtdUsuariosAtivos(id) {
  const query = `
    SELECT
      usuarios_ativos_chat($1) "qtd";
  `;
  const rows = await database.execute(query, [id]);

  return rows[0].qtd;
}

module.exports = {
  listar,
  buscarPorId,
  cadastrar,
  qtdUsuariosAtivos,
};