const { StatusCodes } = require('http-status-codes');
const loginService = require('../services/loginService');

async function login(req, res, next) {
  try {
    const { usuario, senha } = req.body;

    const result = await loginService.login({ usuario, senha });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { login };