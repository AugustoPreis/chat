const { Router } = require('express');
const { verifyJWT } = require('../middlewares/jwt');
const loginController = require('../controllers/loginController');
const { routes: apiRoutes } = require('./api.routes');

const routes = Router();

routes.post('/login', loginController.login);

routes.use('/api', verifyJWT, apiRoutes);

module.exports = { routes };