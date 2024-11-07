const { StatusCodes } = require('http-status-codes');
const { v4 } = require('uuid');
const { RequestError } = require('../utils/RequestError');
const { isValidString, isValidUUID } = require('../utils/validators');
const historicoRepository = require('../repositories/historicoRepository');

async function buscarPorChatUsuario(params) {
  const { usuario, chat } = params;

  if (!isValidUUID(usuario)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Usuário inválido');
  }

  if (!isValidUUID(chat)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Chat inválido');
  }

  return await historicoRepository.buscarPorChatUsuario({ usuario, chat });
}

async function cadastrar(params) {
  const { usuario, chat, tipo, descricao } = params;

  if (!isValidUUID(usuario)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Usuário inválido');
  }

  if (!isValidUUID(chat)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Chat inválido');
  }

  if (!isValidString(tipo)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Tipo inválido');
  }

  await historicoRepository.cadastrar({
    id: v4(),
    usuarioId: usuario,
    chatId: chat,
    tipo,
    descricao,
    dataCadastro: new Date(),
  });

  return buscarPorChatUsuario({ usuario, chat });
}

module.exports = {
  buscarPorChatUsuario,
  cadastrar,
};