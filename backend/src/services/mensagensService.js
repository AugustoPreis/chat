const { v4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const { isValidDate, isValidUUID, isValidString } = require('../utils/validators');
const { RequestError } = require('../utils/RequestError');
const mensagensRepository = require('../repositories/mensagensRepository');

async function buscarPorId(id) {
  if (!isValidUUID(id)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'ID inválido');
  }

  const mensagem = mensagensRepository.buscarPorId(id);

  if (!mensagem) {
    throw new RequestError(StatusCodes.NOT_FOUND, 'Mensagem não encontrada');
  }

  return mensagem;
}

async function buscarMensagensAnteriores(data) {
  if (!isValidDate(data)) {
    return [];
  }

  return mensagensRepository.buscarMensagensAnteriores(data);
}

async function cadastrar(params) {
  const { usuario, chat, descricao } = params;

  if (!isValidUUID(usuario)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Usuário inválido');
  }

  if (!isValidUUID(chat)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Chat inválido');
  }

  if (!isValidString(descricao)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Descrição inválida');
  }

  const id = await mensagensRepository.cadastrar({
    id: v4(),
    usuarioId: usuario,
    chatId: chat,
    descricao,
    dataCadastro: new Date(),
  });

  const mensagemSalva = await buscarPorId(id);

  return { ...mensagemSalva, id };
}

module.exports = {
  buscarMensagensAnteriores,
  cadastrar,
};