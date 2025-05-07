import { EcoNotionServiceQueryBase as Base } from './notion-service-query-base.js'
export class EcoNotionServiceQueryQuestionWrite extends Base {
  constructor () {
    super({
      name: 'EcoNotionServiceQueryQuestionWrite',
      isDebug: false,
      level: 'info',
    })
  }

  get #list () {
    return this.blocks.children.list
  }

  //TODO: Move to base
  async #getPageBlocks (reason, pageId) {
    const logName = `> getPageBlocks > ${reason}`
    this._logInfoBegin(logName, pageId)

    const allBlocks = []
    let cursor = undefined

    do {
      const response = await this.#list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      })

      allBlocks.push(...response.results)
      cursor = response.has_more ? response.next_cursor : null
    } while (cursor)

    this._logInfoEnd(logName, allBlocks.length)
    return allBlocks
  }

  async #getWriteDbId (reason, pageId) {
    const me = this
    const blocks = await me.#getPageBlocks(reason, pageId)
    const arr = blocks
      .filter(
        block =>
          block.type === 'child_database' &&
          block.child_database.title == 'Write Questions'
      )
      .map(block => ({
        id: block.id,
        title: block.child_database.title,
        created_time: block.created_time,
      }))
    if (arr?.length) {
      return arr[0]
    }
    return null
  }

  async getWriteQuestions (reason, pageId) {
    const me = this
    const dbo = await me.#getWriteQuestionsDb(reason, pageId)
    const dbId = dbo?.id
    if (!dbId) return nullÏ
    try {
      const response = await me.databases.query({
        database_id: dbId,
      })

      console.log('Số row:', response.results.length)
      response.results.forEach((page, index) => {
        console.log(`Row ${index + 1}:`, page.id)
      })
      return response.results
      // Nếu bạn muốn lấy thông tin property cụ thể:
      // console.log(page.properties);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ database:', error)
    }
    return dbo
  }

  async #getWriteQuestionsDb (reason, pageId) {
    const me = this
    const blocks = await me.#getPageBlocks(reason, pageId)
    const arr = blocks
      .filter(
        block =>
          block.type === 'child_page' &&
          block.child_page.title?.includes('⚡️ Learn')
      )
      .map(block => ({
        id: block.id,
        title: block.child_page.title,
        created_time: block.created_time,
      }))
    if (arr?.length) {
      const pageId = arr[0].id
      const dbObj = await me.#getWriteDbId(reason, pageId)
      return dbObj
    }
    return null
  }
}
