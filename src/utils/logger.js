import { createLogger, transports, addColors, format } from 'winston'

const { combine, timestamp, printf, prettyPrint, json, colorize } = format

/* Declare custom log levels and corresponding colors */
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    info: 'cyan',
    warn: 'yellow',
    debug: 'green',
    verbose: 'white'
  }
}

/* Assign application environment */
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Custom Logger using Wiston Logger Package
 */
class Logger {
  constructor() {
    const fileTransport = new transports.File({
      maxFiles: 5,
      maxsize: 5120,
      filename: `${__dirname}/../logs/logs.log`,
      level: 'warn',
      format: json()
    })
    const consoleTransport = new transports.Console({
      level: 'info',
      format: colorize()
    })
    this.logger = createLogger({
      format: mainLogFormat,
      level: isProduction ? 'info' : 'trace',
      levels: customLevels.levels,
      transports: [fileTransport, consoleTransport]
    })
    addColors(customLevels.colors)
  }

  trace(msg, meta) {
    this.logger.log('trace', msg, meta)
  }

  debug(msg, meta) {
    this.logger.debug(msg, meta)
  }

  info(msg, meta) {
    this.logger.info(msg, meta)
  }

  error(msg, meta) {
    this.logger.error(msg, meta)
  }

  warn(msg, meta) {
    this.logger.warn(msg, meta)
  }
}

/* Parse incoming log data */
const parser = (data) => {
  if (!data) {
    return ''
  }
  if (typeof data === 'string') {
    return data
  }
  return Object.keys(data).length ? JSON.stringify(data, null, 2) : ''
}

/* Log format for Console and File Logs */
const mainLogFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss:A' }),
  prettyPrint(),
  printf((info) => {
    const { timestamp, level, message, ...meta } = info
    const metaMsg = meta ? ` ${parser(meta)}` : ''
    return `[${timestamp}] [${level}] ${parser(message)} ${metaMsg}`
  })
)

module.exports = new Logger()
