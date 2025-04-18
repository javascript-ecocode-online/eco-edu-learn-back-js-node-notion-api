import { notion } from '../../config/notionClient.js'

import { EcoTextUtil as ETU } from '../../utils/text.js'

export class Lv1Builder {
  _pageId
  _lv1Text
  constructor (pageId) {
    this._pageId = pageId
  }

  _normalizeText (text) {
    return ETU.normalizeText(text)
  }

  async #findLv1Block () {
    const me = this
    const pageId = me._pageId
    const targetText = me._normalizeText(me._lv1Text)
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    })
    const foundBlock = response.results.find(block => {
      if (block.type !== 'toggle') return false
      const richTexts = block.toggle.rich_text || []
      const plainText =
        richTexts
          .map(rt => rt.plain_text)
          .join('')
          .trim() ?? ''
      const compareText = me._normalizeText(plainText)
      console.log(targetText, compareText)

      return compareText === targetText
    })
    return foundBlock
  }

  _getLv1ToggleBlockJson () {
    throw new Error('Need implement _getLv1ToggleBlockJson')
  }
  async _createLv1ToggleBlock () {
    const me = this
    const pageId = me._pageId
    const navMasterBlock1 = me._getLv1ToggleBlockJson()
    const appendResult = await notion.blocks.children.append({
      block_id: pageId,
      children: [].concat(navMasterBlock1),
    })
    if (appendResult.results?.length) {
      return appendResult.results[0]
    }
    return null
  }

  

  async _getLv1Block () {
    const me = this
    let block = await me.#findLv1Block()
    if (block) {
      console.log(`--- Found: nav1 - lv1 block  ${block.id} ---`)
    } else {
      console.log(`--- Need create nav1 - lv1 block ---`)
      block = await me._createLv1ToggleBlock()
    }
    return block
  }

  async #getExistingTexts (blockId) {
    const me = this
    // Lấy danh sách block con hiện tại của toggle block
    const toggleChildrenRes = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
    })

    const existingTexts = new Set(
      toggleChildrenRes.results
        .flatMap(block => {
          const richText = block[block.type]?.rich_text
          if (!richText) return []
          return richText.map(rt => me._normalizeText(rt.plain_text))
        })
        .filter(text => text) // loại bỏ undefined/null
    )
    return existingTexts
  }

  async #getUniqueNewBlocks (blockId, newLv2Blocks) {
    const me = this
    const existingTexts = await me.#getExistingTexts(blockId)
    const uniqueNewBlocks = newLv2Blocks.filter(block => {
      const richText = block[block.type]?.rich_text
      if (!richText) return true
      const combinedText = richText
        .map(rt => me._normalizeText(rt.plain_text))
        .join('')
      return !existingTexts.has(combinedText)
    })
    return uniqueNewBlocks
  }

  async #appendLevel2Block (blockId, uniqueNewBlocks) {
    await notion.blocks.children.append({
      block_id: blockId,
      children: uniqueNewBlocks,
    })
  }

  async _getLv2Blocks(){
    throw new Error('Need implement _getLv2Blocks')
  }

  async _onExecuteDone(blockId){

  }

  async execute () {
    const me = this
    const toggleBlock = await me._getLv1Block()
    const blockId = toggleBlock.id
    const newLv2Blocks = me._getLv2Blocks(blockId)
    // Lọc các block mới không trùng text
    const uniqueNewBlocks = await me.#getUniqueNewBlocks(blockId, newLv2Blocks)

    if (uniqueNewBlocks.length === 0) {
      console.log('Không có block mới để thêm.')
      return
    }

    // Thêm block mới không trùng
    await me.#appendLevel2Block(blockId, uniqueNewBlocks)
    await me._onExecuteDone(blockId)

    console.log(`Đã thêm ${uniqueNewBlocks.length} block vào toggle.`)
  }
}
