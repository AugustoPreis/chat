const { StatusCodes } = require('http-status-codes');
const usuarioService = require('../services/usuarioService');

async function buscarPorId(req, res, next) {
  try {
    const { id } = req.params;

    const result = await usuarioService.buscarPorId(id);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req, res, next) {
  try {
    const result = await usuarioService.cadastrar(req.body);

    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const { id } = req.params;

    req.body.id = id;

    const result = await usuarioService.atualizar(req.body, req.user);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { buscarPorId, cadastrar, atualizar };