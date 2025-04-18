import winston from 'winston'
export class EcoServiceBase {
  #logger
  #logConfig
  get #isDebug () {
    return this.#logConfig?.isDebug ?? false
  }
  get #logLevel () {
    return this.#logConfig?.level ?? 'info'
  }
  get #logName () {
    return this.#logConfig?.name ?? 'EcoServiceBase'
  }
  constructor (logConfig) {
    this.#setLogConfig(logConfig)
      .#createLogger()
      ._logInfo('> Eco Service Created')
  }
  #setLogConfig (logConfig) {
    this.#logConfig = logConfig
    return this
  }

  #createLogger () {
    const level = this.#logLevel
    // error warn info http verbose debug silly
    this.#logger = winston.createLogger({
      level: level,
      format: winston.format.combine(
        winston.format.colorize(), 
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] [${level.toUpperCase()}] ${message}`
        })
      ),
      transports: [new winston.transports.Console()],
    })
    return this
  }

  #normalizeValue (value) {
    return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  }

  _logInfoBegin (obj1, obj2) {
    this._logInfo(`--- Bgn --- : ${obj1}`, obj2)
  }

  _logInfoEnd (obj1, obj2) {
    this._logInfo(`--- End ---: ${obj1}`, obj2)
  }

  _logInfo (obj1, obj2) {
    const text1 = this.#normalizeValue(obj1)
    const text2 = this.#normalizeValue(obj2)
    const name = `⚡️ ${this.#logName}`

    if (this.#isDebug && (text1 || text2))
      text1 && text2
        ? this.#logger.info(`${name} / ${text1} / ${text2}`)
        : text1
        ? this.#logger.info(`${name} / ${text1}`)
        : this.#logger.info(`${name} / ${text2}`)
  }
}
