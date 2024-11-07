const { StatusCodes } = require('http-status-codes');
const chatService = require('../services/chatService');

async function listar(req, res, next) {
  try {
    const { filtro } = req.query;

    const result = await chatService.listar({ filtro });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const { id } = req.params;

    const result = await chatService.buscarPorId(id);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req, res, next) {
  try {
    const result = await chatService.cadastrar(req.body, req.user);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, buscarPorId, cadastrar };