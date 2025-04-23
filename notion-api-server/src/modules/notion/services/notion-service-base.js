import { notion } from '../clients/notion-client.js'
import { EcoBase } from '../../../base/eco-base.js'

export class EcoNotionServiceBase extends EcoBase{
  constructor (logConfig) {
    super(logConfig)
  }

  get _notionClient () {
    return notion
  }

}
