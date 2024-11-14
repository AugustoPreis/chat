const socketIo = require('socket.io');
const { logger } = require('../utils/logger');
const { decode } = require('../utils/jwt');
const { isValidString } = require('../utils/validators');
const chatService = require('../services/chatService');
const historicoService = require('../services/historicoService');
const mensagensService = require('../services/mensagensService');
const { RequestError } = require('../utils/RequestError');

function adicionaMiddlewares(io) {
  io.use(async (socket, next) => {
    try {
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
    } catch (err) {
      handleSocketError(err);
    }
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
  try {
    logger('info', `Usuário "${socket.user.id}" conectado no chat "${socket.chat.id}"`);

    const permiteEntrar = await chatService.permiteEntrar(socket.chat.id);

    if (!permiteEntrar) {
      await historicoService.cadastrar({
        usuario: socket.user.id,
        chat: socket.chat.id,
        tipo: 'bloqueio-conexao',
      });

      socket.disconnect();

      logger('info', `Usuário "${socket.user.nome}" disconectado do chat "${socket.chat.nome}" por: Sala cheia`);

      return;
    }

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
  } catch (err) {
    handleSocketError(err);
  }
}

async function quandoDesconectar(socket) {
  try {
    socket.on('disconnect', async () => {
      logger('info', `Usuário ${socket.user.id} desconectado do chat ${socket.chat.id}`);

      await historicoService.cadastrar({
        usuario: socket.user.id,
        chat: socket.chat.id,
        tipo: 'desconectou',
      });
    });
  } catch (err) {
    handleSocketError(err);
  }
}

async function enviaMensagensAnteriores(socket) {
  try {
    const mensagensAnteriores = await mensagensService.buscarMensagensAnteriores(socket.connectionDate);

    socket.emit('mensagens-anteriores', mensagensAnteriores);
  } catch (err) {
    handleSocketError(err);
  }
}

async function quandoReceberMensagem(socket, io) {
  socket.on('mensagem', async (descricao) => {
    try {
      const mensagemSalva = await mensagensService.cadastrar({
        descricao,
        usuario: socket.user.id,
        chat: socket.chat.id,
      });

      socket.server.emit('mensagem-recebida', mensagemSalva);
    } catch (err) {
      handleSocketError(err);
    }
  });
}

function handleSocketError(error) {
  const message = formatSocketError(error);

  logger('error', message);
}

function formatSocketError(error) {
  if (!error) {
    return 'Erro desconhecido';
  }

  if (error instanceof RequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch (error) {
    console.error('Impossível formatar error do socket: ', error);
  }
}

module.exports = { start };