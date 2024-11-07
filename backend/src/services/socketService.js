const socketIo = require('socket.io');
const { logger } = require('../utils/logger');
const { decode } = require('../utils/jwt');
const { isValidString } = require('../utils/validators');
const chatService = require('../services/chatService');
const historicoService = require('../services/historicoService');
const mensagensService = require('../services/mensagensService');

function adicionaMiddlewares(io) {
  io.use(async (socket, next) => {
    const { token, chatId } = socket.handshake.auth;

    socket.connectionDate = new Date();

    if (isValidString(token)) {
      socket.user = decode(token);
    }

    if (isValidString(chatId)) {
      socket.chat = await chatService.buscarPorId(chatId);
      socket.chat.id = chatId;
    }

    if (!socket.user) {
      return next({ message: 'Usuário não autenticado' });
    }

    next();
  });
}

async function start(httpServer) {
  const io = socketIo(httpServer, {
    cors: {
      origin: '*',
    },
  });

  adicionaMiddlewares(io);

  io.on('connection', (socket) => quandoConectar(socket, io));
}

async function quandoConectar(socket, io) {
  logger('info', `Usuário "${socket.user.nome}" conectado no chat "${socket.chat.nome}"`);

  await historicoService.cadastrar({
    usuario: socket.user.id,
    chat: socket.chat.id,
    tipo: 'conectou',
  });

  //listeners
  quandoDesconectar(socket);
  quandoReceberMensagem(socket, io);

  //emitters
  enviaMensagensAnteriores(socket);
}

async function quandoDesconectar(socket) {
  socket.on('disconnect', async () => {
    logger('info', `Usuário ${socket.user.id} desconectado do chat ${socket.chat.id}`);

    await historicoService.cadastrar({
      usuario: socket.user.id,
      chat: socket.chat.id,
      tipo: 'desconectou',
    });
  });
}

async function enviaMensagensAnteriores(socket) {
  const mensagensAnteriores = await mensagensService.buscarMensagensAnteriores(socket.connectionDate);

  socket.emit('mensagens-anteriores', mensagensAnteriores);
}

async function quandoReceberMensagem(socket, io) {
  socket.on('mensagem', async (descricao) => {
    const mensagemSalva = await mensagensService.cadastrar({
      descricao,
      usuario: socket.user.id,
      chat: socket.chat.id,
    });

    socket.server.emit('mensagem-recebida', mensagemSalva);
  });
}

module.exports = { start };