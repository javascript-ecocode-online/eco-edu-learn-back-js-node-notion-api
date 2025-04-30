import winston from 'winston'

export class EcoBase {
  #logger
  #logConfig
  constructor (logConfig) {
    this.#setLogConfig(logConfig).#createLogger()
    //._logInfo('> Eco Base Created')
  }

  get #isString () {
    return typeof this.#logConfig === 'string'
  }

  get #isDebug () {
    if (this.#isString) return false
    return this.#logConfig?.isDebug ?? false
  }
  get #logLevel () {
    if (this.#isString) return 'info'
    return this.#logConfig?.level ?? 'info'
  }
  get #logName () {
    if (this.#isString) return this.#logConfig
    return this.#logConfig?.name ?? 'EcoBase'
  }
  get _logName () {
    return this.#logName
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
  _logLines (...args) {
    args?.forEach(arg => console.log(arg))
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
  _logInfoBegin (obj1, obj2) {
    if(!this.#isDebug) return
    this._logInfo(`--- Bgn --- : ${obj1}`, obj2)
  }

  _logInfoEnd (obj1, obj2) {
    if(!this.#isDebug) return
    this._logInfo(`--- End ---: ${obj1}`, obj2)
  }

  _logDeep (label, obj, indent = 0) {
    const me = this
    
    if (indent == 0) {
      console.log('logDeep:', label)
      console.log(obj)
      console.log('------------- !!! ------------- ')
    }
    const padding = '  '.repeat(indent)

    if (Array.isArray(obj)) {
      console.log(`${padding}[`)
      for (const item of obj) {
        me._logDeep(label, item, indent + 1)
      }
      console.log(`${padding}]`)
    } else if (obj && typeof obj === 'object') {
      console.log(`${padding}{`)
      for (const key in obj) {
        const value = obj[key]
        const nextPadding = '  '.repeat(indent + 1)
        process.stdout.write(`${nextPadding}${key}: `)
        const endLogText = `${nextPadding}// --- end ${key} (lv: ${indent}) --- `
        if (typeof value === 'object' && value !== null) {
          console.log() // xuống dòng trước khi log object con
          me._logDeep(label, value, indent + 2)
          console.log(endLogText)
        } else {
          console.log(value)
        }
       
      }
      console.log(`${padding}}`)
    } else {
      console.log(`${padding}${obj}`)
    }
  }

  static _instance = null
  static get instance () {
    if (!this._instance) {
      this._instance = new this()
    }
    return this._instance
  }
}
