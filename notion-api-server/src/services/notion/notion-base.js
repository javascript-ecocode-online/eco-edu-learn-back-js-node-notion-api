import { notion } from '../../config/notionClient.js'
import { EcoServiceBase } from '../eco-service-base.js'

export class NotionBase extends EcoServiceBase{
  constructor (logConfig) {
    super(logConfig)
  }

  get _notionClient () {
    return notion
  }

  static _instance = null

  static get instance () {
    if (!this._instance) {
      this._instance = new this()
    }
    return this._instance
  }
}
