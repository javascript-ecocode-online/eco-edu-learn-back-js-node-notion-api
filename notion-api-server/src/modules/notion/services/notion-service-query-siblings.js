import { EcoNotionServiceQueryBase as Base } from './notion-service-query-base.js'
export class EcoNotionServiceQuerySiblings extends Base {
  constructor () {
    super({ name: 'NotionQuerySiblings', isDebug: true, level: 'info' })
  }
  get #list () {
    return this.blocks.children.list
  }
  get #retrievePages () {
    return this.pages.retrieve
  }
  async getSiblingPages (reason, pageId) {
    const me = this;
    const logName = `> getSiblingPages > ${reason}`
    this._logInfoBegin(logName, pageId)
    const page = await me.#retrievePages({ page_id: pageId })

    if (page.parent.type !== 'page_id') {
      return []
    }

    const parentId = page.parent.page_id
    const response = await me.#list({ block_id: parentId })
    const rs = response.results
      .filter(block => block.type === 'child_page')
      .map(block => ({
        id: block.id,
        title: block.child_page.title,
        parentId,
        created_time: block.created_time,
      }))
    this._logInfoEnd(logName, rs.length)
    return rs
  }
}
