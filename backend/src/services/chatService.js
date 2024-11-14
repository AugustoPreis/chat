const { StatusCodes } = require('http-status-codes');
const { v4 } = require('uuid');
const { RequestError } = require('../utils/RequestError');
const { isValidString, isValidNumber, isValidUUID } = require('../utils/validators');
const chatRepository = require('../repositories/chatRepository');

async function listar(params) {
  let filtro = '';

  if (isValidString(params.filtro)) {
    filtro = params.filtro.trim();
  }

  return await chatRepository.listar(filtro);
}

async function buscarPorId(id) {
  if (!isValidUUID(id)) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'ID inválido');
  }

  const chat = await chatRepository.buscarPorId(id);

  if (!chat) {
    throw new RequestError(StatusCodes.NOT_FOUND, `Chat ${id} não encontrado`);
  }

  return chat;
}

async function permiteEntrar(id) {
  const chat = await buscarPorId(id);
  const qtdUsuariosAtivos = await chatRepository.qtdUsuariosAtivos(id);
  const result = { permite: true };

  if (qtdUsuariosAtivos >= chat.qtdMaximaUsuarios) {
    result.permite = false;
    result.motivo = 'Chat cheio';
  }

  return result;
}

async function cadastrar(params, usuarioLogado) {
  const { nome, qtdMaximaUsuarios, privado } = params;

  if (!isValidString(nome) || nome.length > 100) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Nome inválido');
  }

  if (!isValidNumber(qtdMaximaUsuarios) || qtdMaximaUsuarios > 100) {
    throw new RequestError(StatusCodes.BAD_REQUEST, 'Qtd. Máxima de Usuários inválida');
  }

  const id = await chatRepository.cadastrar({
    id: v4(),
    usuarioId: usuarioLogado.id,
    nome: nome.trim(),
    privado: !!privado,
    qtdMaximaUsuarios,
  });

  const chatSalvo = buscarPorId(id);

  return { id, ...chatSalvo };
}

module.exports = {
  listar,
  buscarPorId,
  cadastrar,
  permiteEntrar,
}