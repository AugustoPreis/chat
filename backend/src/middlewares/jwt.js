const { TokenExpiredError, verify } = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { isValidString } = require('../utils/validators');

function verifyJWT(req, res, next) {
  const token = req.headers.authorization;

  if (!isValidString(token)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      auth: false,
      message: 'Usuário não autenticado',
    });

    return;
  }

  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      let message = 'Falha na autentificação';

      if (err instanceof TokenExpiredError) {
        message = 'Login expirado.';
      }

      return res.status(StatusCodes.UNAUTHORIZED).send({ auth: false, message });
    }

    delete decoded.exp;
    delete decoded.iat;

    req.user = decoded;

    next();
  });
}

module.exports = { verifyJWT };