import { EcoNotionServiceQueryBase as Base } from './notion-service-query-base.js'
export class EcoNotionServiceDbBase extends Base {
  constructor () {
    super({
      name: 'EcoNotionServiceDb',
      isDebug: false,
      level: 'info',
    })
  }
  get #list () {
    return this.blocks.children.list
  }
  //TODO: Move to base
  async _getPageBlocks (reason, pageId) {
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

  async _getLearnPageId (reason, pageId) {
    const me = this
    const blocks = await me._getPageBlocks(reason, pageId)
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
      return pageId
    }
    return null
  }

  _getDbBlocks (blocks) {
    const arr = blocks?.filter(block => block.type === 'child_database')
    return arr
  }

  _getDbByName (blocks, name) {
    const arr = (
      name ? blocks.filter(block => block.child_database.title === name) : blocks
    )
   
    return arr
  }

  _getDbInfo (db) {
    const arr = db?.map(block => ({
      id: block.id,
      title: block.child_database.title,
      created_time: block.created_time,
    }))
   
    return arr
  }

  async _getDbArrFromName (reason, pageId, dbName) {
    const me = this
    const learnPageId = await me._getLearnPageId(reason, pageId)
    if (!learnPageId) return []
    const learnBlocks = await me._getPageBlocks(reason, learnPageId)
    const dbBlocks = me._getDbBlocks(learnBlocks)
    const db = me._getDbByName(dbBlocks, dbName)
    return db

  }
  async _getQuestions (reason, pageId, dbName) {
    const me = this
    const dbArr = await me._getDbArrFromName(reason, pageId, dbName)
    //console.log('dbArr',  dbArr)
    const dbos = me._getDbInfo(dbArr)
    const dbo = dbos?.length ? dbos[0]: null
    const dbId = dbo?.id
    if (!dbId) return null
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
}
