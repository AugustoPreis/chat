const { Router } = require('express');
const chatController = require('../controllers/chatController');

const routes = Router();

//chats
routes.get('/chats', chatController.listar);
routes.get('/chats/:id', chatController.buscarPorId);
routes.post('/chats', chatController.cadastrar);

module.exports = { routes };