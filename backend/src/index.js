require('dotenv/config');

const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { connect } = require('./config/database');
const socketService = require('./services/socketService');
const { errorHandler } = require('./middlewares/errorHandler');
const { routes } = require('./routes/routes');
const { logger } = require('./utils/logger');

async function startServer(port) {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors());
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(express.json({ limit: '50mb' }));
  app.use(routes);
  app.use(errorHandler);

  //build de produção
  app.use(express.static(path.join(__dirname, './dist')));
  app.get('/*', (_, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
  });

  await connect(true);
  logger('info', 'Banco conectado');

  await socketService.start(httpServer);
  logger('info', 'Socket iniciado');

  httpServer.listen(port, () => {
    logger('info', 'Servidor iniciado na porta', port);
  });
}

startServer(process.env.PORT);