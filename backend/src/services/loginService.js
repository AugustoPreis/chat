const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { RequestError } = require('../utils/RequestError');
const { sign } = require('../utils/jwt');
const { isValidString } = require('../utils/validators');
const { compare } = require('../utils/crypt');
const usuarioRepository = require('../repositories/usuarioRepository');

async function login(params) {
  const { usuario, senha } = params;

  if (!isValidString(usuario)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Nome de usuário não informado');
  }

  if (!isValidString(senha)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Senha não informada');
  }

  const usuarioSalvo = await usuarioRepository.buscarPorLogin(usuario);

  if (!usuarioSalvo || !compare(senha, usuarioSalvo.senha)) {
    throw new RequestError(StatusCodes.UNAUTHORIZED, 'Login inválido');
  }

  const usuarioJWT = {
    id: usuarioSalvo.id,
    nome: usuarioSalvo.nome,
    admin: usuarioSalvo.admin,
    token: null,
    dataLogin: new Date(),
  };

  usuarioJWT.token = sign(usuarioJWT);

  return usuarioJWT;
}

module.exports = { login };