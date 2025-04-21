import { EcoNotionServiceBase as Base } from './notion-service-base.js'

export class EcoNotionServiceQueryBase extends Base {
  constructor (logConfig) {
    super(logConfig)
  }

  get blocks () {
    //notion.blocks.children.list
    return this._notionClient.blocks
  }

  get pages () {
    //notion.pages.retrieve
    return this._notionClient.pages
  }

  get databases () {
    //notion.pages.retrieve
    return this._notionClient.databases
  }
}
