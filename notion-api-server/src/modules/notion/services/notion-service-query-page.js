import { EcoNotionServiceQueryBase as Base } from './notion-service-query-base.js'
export class EcoNotionServiceQueryPage extends Base {
  constructor () {
    super({ name: 'EcoNotionServiceQueryPage', isDebug: false, level: 'info' })
  }

  get #retrievePages () {
    return this.pages.retrieve
  }

  async getPageInfo (reason, pageId) {
    const me = this
    const logName = `> 🍭 getPageInfo > ${reason}`
    this._logInfoBegin(logName, pageId)

    const info = await me.#retrievePages({ page_id: pageId })

    this._logInfoEnd(logName, info)
    return info
  }

  async getPageCoverImageUrl (reason, pageId) {
    const me = this
    const info = await me.getPageInfo(reason, pageId)
    return info?.cover?.external?.url
  }
}
