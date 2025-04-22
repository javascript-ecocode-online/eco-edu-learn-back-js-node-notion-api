import { notion } from '../../../config/notionClient.js'
import { EcoBase } from '../../../base/base.js'

export class EcoNotionServiceBase extends EcoBase{
  constructor (logConfig) {
    super(logConfig)
  }

  get _notionClient () {
    return notion
  }

}
