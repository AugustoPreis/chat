const { format } = require('date-fns');
const winston = require('winston');

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
});

winstonLogger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }),
);

function logger(level, ...content) {
  const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const message = `[${date}] ${content.join(' ')}`;

  winstonLogger.log({ level, message });
}

module.exports = { logger };