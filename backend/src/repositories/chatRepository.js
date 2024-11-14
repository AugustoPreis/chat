const database = require('../config/database');

async function listar(filtro) {
  const sql = `
    SELECT
      tab.*
    FROM (
      SELECT
        chats.id,
        chats.nome,
        chats.qtd_maxima_usuarios "qtdMaximaUsuarios",
        usuarios_ativos_chat(chats.id) "qtdAtualUsuarios"
      FROM chats
      WHERE chats.privado IS FALSE
        AND chats.nome ILIKE '%'||$1||'%'
    ) AS tab
    WHERE tab."qtdAtualUsuarios" > 0
    ORDER BY tab.nome, tab."qtdAtualUsuarios" DESC
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
      usuarios_ativos_chat(chats.id) "qtdAtualUsuarios"
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
      qtd_maxima_usuarios,
      privado
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
    params.nome,
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