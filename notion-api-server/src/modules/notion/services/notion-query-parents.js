import { getTitle } from '../../../utils/title.js' // nếu bạn dùng helper tách title
import { NotionQueryBase as Base } from './notion-query-base.js'
export class NotionQueryParents extends Base {
  constructor () {
    super({ name: 'NotionQueryParents', isDebug: true, level: 'info' })
  }
  async getAllParentPages (reason, pageId) {
    const me = this
    const logName = `> getAllParentPages > ${reason}`
    this._logInfoBegin(logName, pageId)

    const result = []
    let currentId = pageId
    while (currentId) {
      const page = await me.#retrievePages({ page_id: currentId })
      if (page.parent?.type === 'page_id') {
        currentId = await me.#pushAndGetParentPage(page, result)
      } else if (page.parent?.type === 'database_id') {
        await me.#pushAndGetParentDb(page, result)
        break // database là gốc → dừng lại
      } else {
        break // workspace hoặc unknown → dừng
      }
    }
    this._logInfoEnd(logName, result.length)
    return result
  }
  get #retrievePages () {
    return this.pages.retrieve
  }
  get #retrieveDatabases () {
    return this.databases.retrieve
  }
  async #pushAndGetParentPage (page, result) {
    const me = this
    const parentId = page.parent.page_id
    const parent = await me.#retrievePages({ page_id: parentId })
    const title = getTitle(parent)
    result.push({
      id: parentId,
      title: title,
      type: 'page',
    })
    return parentId
  }
  async #pushAndGetParentDb (page, result) {
    const me = this
    const databaseId = page.parent.database_id
    const db = await me.#retrieveDatabases({ database_id: databaseId })
    const title = db.title?.[0]?.plain_text || '(Untitled Database)'
    result.push({
      id: databaseId,
      title: title,
      type: 'database',
    })
  }
  
}
