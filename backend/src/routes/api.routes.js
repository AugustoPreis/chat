const { Router } = require('express');
const chatController = require('../controllers/chatController');
const usuarioController = require('../controllers/usuarioController');

const routes = Router();

//chats
routes.get('/chats', chatController.listar);
routes.get('/chats/:id', chatController.buscarPorId);
routes.post('/chats', chatController.cadastrar);

//usuarios
routes.get('/usuarios/:id', usuarioController.buscarPorId);
routes.post('/usuarios', usuarioController.cadastrar);
routes.put('/usuarios/:id', usuarioController.atualizar);

module.exports = { routes };