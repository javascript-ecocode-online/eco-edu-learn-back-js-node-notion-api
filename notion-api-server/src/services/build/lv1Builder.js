import { notion } from '../../config/notionClient.js'
import { Lv0Builder } from './lv0Builder.js'

import { EcoTextUtil as ETU } from '../../utils/text.js'

export class Lv1Builder extends Lv0Builder {
  _pageId
  _lv1Text () {
    throw new Error('Lv1Builder > _lv1Text need implement!')
  }
  constructor (name, pageId) {
    super(name)
    this._pageId = pageId
  }

  _normalizeText (text) {
    return ETU.normalizeText(text)
  }

  async #findLv1Block () {
    const me = this
    const nqc = this._nqc
    const pageId = me._pageId
    const targetText = me._normalizeText(me._lv1Text())
    const reason = `Lv1Builder > findLv1Block > Get-all-from-Page`
    const results = await nqc.getToggleChildrenById(reason, pageId)

    const foundBlock = results?.find(block => {
      const richTexts = block.toggle.rich_text || []
      const plainText =
        richTexts
          .map(rt => rt.plain_text)
          .join('')
          .trim() ?? ''
      const compareText = me._normalizeText(plainText)
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
      console.log(`--- No create nav1 lv1 block > Found: id = ${block.id} ---`)
    } else {
      console.log(`--- Need create nav1 lv1 block ---`)
      block = await me._createLv1ToggleBlock()
    }
    return block
  }

  async #getExistingTexts (toggleChildrenRes) {
    const me = this
    // Lấy danh sách block con hiện tại của toggle block

    const existingTexts = new Set(
      toggleChildrenRes
        .flatMap(block => {
          const richText = block[block.type]?.rich_text
          if (!richText) return []
          return richText.map(rt => me._normalizeText(rt.plain_text))
        })
        .filter(text => text) // loại bỏ undefined/null
    )
    return existingTexts
  }

  async #getNewCompareData (newLv2Blocks) {
    const me = this
    const existingTexts = newLv2Blocks.flatMap(block => {
      const richText = block[block.type]?.rich_text
      if (!richText) return []
      return richText
        .map(rt => {
          const normalized = me._normalizeText(rt.text.content)
          if (!normalized) return null
          return {
            data: block,
            text: normalized,
          }
        })
        .filter(item => item !== null)
    })

    return existingTexts
  }

  async #getUniqueNewOrExistingBlocks (blockId, newLv2Blocks) {
    const me = this
    const nqc = this._nqc
    const reason = 'Lv1Builder > #getUniqueNewOrExistingBlocks'
    const lv2ExistingAllBlocks = await nqc.getAllChildrenById(reason, blockId)

    const newCompareData = await me.#getNewCompareData(newLv2Blocks)

    const lv2AllExistingTexts = await me.#getExistingTexts(lv2ExistingAllBlocks)
    //console.log('newLv2Blocks', newLv2Blocks)
    //console.log('existingTexts', existingTexts)
    const lv2UniqueNewBlocks = newLv2Blocks.filter(block => {
      const richText = block[block.type]?.rich_text
      if (!richText) return true
      //console.log('richText', richText)
      //rt.plain_text
      const combinedText = richText
        .map(rt => me._normalizeText(rt.text.content))
        .join('')
      //console.log('combinedText', combinedText)
      return !lv2AllExistingTexts.has(combinedText)
    })

    const lv2ExistingTargetBlocks = lv2ExistingAllBlocks.filter(
      block => {
        const richText = block[block.type]?.rich_text
        //console.log('existingBlocks > richText: ', richText)
        if (!richText) return true
        //console.log('richText', richText)
        //rt.plain_text
        const combinedText = richText
          .map(rt => me._normalizeText(rt.text.content))
          .join('')
        //console.log('newTexts', newTexts)
        //console.log('combinedText', combinedText)
        //const isInclude = newCompareData.has(combinedText)
        const isInclude = newCompareData.some(
          item => item.text === combinedText
        )
        const match = newCompareData.find(item => item.text === combinedText)
        const blockData = match ? match.data : null
        //console.log('isInclude', isInclude)
        //console.log('blockData > children', blockData.toggle.children)
        if (isInclude && blockData.toggle.children)
          block.newChildren = blockData.toggle.children
        return isInclude
      }
    )
    //console.log('$$$ existingBlocks (lv2)', existingBlocks)
    return {
      lv2UniqueNewBlocks: lv2UniqueNewBlocks,
      lv2ExistingTargetBlocks: lv2ExistingTargetBlocks,
    }
  }

  async #appendLevel2Block (blockId, uniqueNewBlocks) {
    await notion.blocks.children.append({
      block_id: blockId,
      children: uniqueNewBlocks,
    })
  }
  /* Result: 
  [
    {
      object: 'block',
      type: 'toggle',
      toggle: { rich_text: [Array], children: [Array] }
    },
    {
      object: 'block',
      type: 'toggle',
      toggle: { rich_text: [Array], children: [Array] }
    }
  ]
*/
  async _getLv2Blocks () {
    throw new Error('Need implement _getLv2Blocks')
  }

  async _onExecuteDone (lv1BlockId) {
    throw new Error(`Need implement _onExecuteDone, lv1BlockId: ${lv1BlockId}`)
  }
  async _buildLevel3Blocks (level1BlockId, newLv2Blocks) {
    console.log(`Không có block lv3 cho block lv1: ${level1BlockId}...`)
  }
  async execute () {
    const me = this
    
    const toggleBlock = await me._getLv1Block()
    const lv1BlockId = toggleBlock.id
    const newLv2Blocks = me._getLv2Blocks(lv1BlockId)
    //console.log('newLv2Blocks', newLv2Blocks)
    // Lọc các block mới không trùng text
    const { lv2UniqueNewBlocks, lv2ExistingTargetBlocks } =
      await me.#getUniqueNewOrExistingBlocks(lv1BlockId, newLv2Blocks)
    if (lv2ExistingTargetBlocks.length !== 0) {
      await me._buildLevel3Blocks(lv1BlockId, lv2ExistingTargetBlocks)
    }
    if (lv2UniqueNewBlocks.length === 0) {
      console.log('Không có các blocks mới lv2 để thêm.')
    } else {
      // Thêm block mới không trùng
      await me.#appendLevel2Block(lv1BlockId, lv2UniqueNewBlocks)
      console.log(
        `Đã thêm ${lv2UniqueNewBlocks.length} block lv2 vào toggle lv1.`
      )
    }
    console.log('Kiểm tra và bổ sung các blocks level > 3...')
    await me._onExecuteDone(lv1BlockId)
    return lv2UniqueNewBlocks
  }
}
