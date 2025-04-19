import { NotionQueryBase as Base } from './notion-query-base.js'
export class NotionQueryChildren extends Base {
  constructor () {
    super({ name: 'NotionQueryChildren', isDebug: true, level: 'info' })
  }

  get #list () {
    return this.blocks.children.list
  }

  async getPageBlocks (reason, pageId) {
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

  async getChildrenPages (reason, allBlocksOrPageId) {
    const me = this;
    const isArray = Array.isArray(allBlocksOrPageId)
    const results = isArray
      ? allBlocksOrPageId
      : await me.getPageBlocks(reason, allBlocksOrPageId)
    return results
      .filter(block => block.type === 'child_page')
      .map(block => ({
        id: block.id,
        title: block.child_page.title,
        created_time: block.created_time,
      }))
  }

  //page_size: 100
  async #getChildrenById (blockId) {
    try {
      const response = await this.#list({ block_id: blockId })
      return response.results
    } catch (error) {
      console.error('Error NotionQueryChildren > getChildrenById:', error)
      return null
    }
  }

  async getAllChildrenById (reason, blockId) {
    const logName = `> getAllChildrenById > ${reason}`

    this._logInfoBegin(logName, blockId)

    //results
    const rs = await this.#getChildrenById(blockId)
    //const rs = results.filter(block => block.type === 'toggle')

    this._logInfoEnd(logName, rs.length)

    return rs
  }

  async getToggleChildrenById (reason, blockId) {
    const logName = `> getToggleChildrenById > ${reason}`

    this._logInfoBegin(logName, blockId)

    const results = await this.#getChildrenById(blockId)
    const rs = results.filter(block => block.type === 'toggle')

    this._logInfoEnd(logName, rs.length)

    return rs
  }
}
