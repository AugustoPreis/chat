const { StatusCodes } = require('http-status-codes');
const { v4 } = require('uuid');
const usuarioRepository = require('../repositories/usuarioRepository');
const { isValidString, isValidUUID } = require('../utils/validators');
const { RequestError } = require('../utils/RequestError');
const { hash } = require('../utils/crypt');

async function buscarPorId(id) {
  if (!isValidUUID(id)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Id inválido');
  }

  const usuarioPorId = await usuarioRepository.buscarPorId(id);

  if (!usuarioPorId) {
    throw new RequestError(StatusCodes.NOT_FOUND, `Usuário com ID ${id} não encontrado`);
  }

  return usuarioPorId;
}

async function cadastrar(params) {
  const { nome, login, senha } = params;

  if (!isValidString(nome)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Nome inválido');
  }

  if (!isValidString(login)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Login não informado');
  }

  if (!isValidString(senha)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Senha não informada');
  }

  const usuarioPorLogin = await usuarioRepository.buscarPorLogin(login);

  if (usuarioPorLogin) {
    throw new RequestError(StatusCodes.CONFLICT, 'Já existe um usuário cadastrado com este login');
  }

  const id = await usuarioRepository.salvar({
    id: v4(),
    nome,
    login,
    senha: hash(senha),
    ativo: true,

    //TODO: Cadastro de admins
    admin: false,
  });

  const usuarioSalvo = await buscarPorId(id);

  return { id, ...usuarioSalvo };
}

async function atualizar(params, usuarioLogado) {
  const { id, nome, login, senha } = params;

  const usuarioPorId = await buscarPorId(id);

  /*
    O usuário so pode alterar ele mesmo
    Apenas admins podem alterar outros usuários
  */
  if (id !== usuarioLogado.id && !usuarioLogado.admin) {
    throw new RequestError(StatusCodes.FORBIDDEN, 'Você não possui autorização para alterar outros usuários');
  }

  if (!isValidString(nome)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Nome inválido');
  }

  if (!isValidString(login)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Login não informado');
  }

  usuarioPorId.id = id;
  usuarioPorId.nome = nome;
  usuarioPorId.login = login;

  if (isValidString(senha)) {
    usuarioPorId.senha = hash(senha);
  }

  await usuarioRepository.atualizar(usuarioPorId);

  delete usuarioPorId.senha;

  return usuarioPorId;
}

module.exports = { buscarPorId, cadastrar, atualizar };