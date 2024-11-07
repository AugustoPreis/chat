const database = require('../config/database');

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

module.exports = { buscarPorLogin };