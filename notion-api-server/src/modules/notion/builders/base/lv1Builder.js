import { Lv0Builder } from './lv0Builder.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'
import { EcoNotionServiceBuildBlockPage } from '../../services/notion-service-build-block-page.js'
import { EcoNotionServiceBuildBlockToggle } from '../../services/notion-service-build-block-toggle.js'

import { EcoTextUtil as ETU } from '../../../../utils/text.js'

export class Lv1Builder extends Lv0Builder {
  _pageId
  _buildCfg
  _lv1Text () {
    throw new Error('Lv1Builder > _lv1Text need implement!')
  }
  get _isResetRichText () {
    return this._buildCfg?.isResetRichText ?? false
  }
  get _isResetChildren () {
    return this._buildCfg?.isResetChildren ?? false
  }
  constructor (logCfg, pageId, buildCfg) {
    super(logCfg)
    this._pageId = pageId
    this._buildCfg = buildCfg
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
    //console.log('📍 ----- foundBlock: -----', foundBlock)
    return foundBlock
  }

  _getLv1ToggleBlockRichTextArr () {
    throw new Error('Need implement _getLv1ToggleBlockRichTextArr')
  }
  _getLv1ToggleBlockJson () {
    const me = this
    const richTextArr = me._getLv1ToggleBlockRichTextArr()
    const blockBuilder = new EcoNotionBuilderBlockToggle()
    return blockBuilder.setRichTextArray(richTextArr).oBlockRaw
  }
  async _createLv1ToggleBlock () {
    const me = this
    const pageId = me._pageId
    const navMasterBlock1 = me._getLv1ToggleBlockJson()
    if (!navMasterBlock1) return null
    const svc = new EcoNotionServiceBuildBlockPage()
    return await svc.appendChild(pageId, navMasterBlock1)
    //
  }

  async #appendLevel2Block (blockId, uniqueNewBlocks) {
    const svc = new EcoNotionServiceBuildBlockToggle()
    const rs = await svc.appendChildren(blockId, uniqueNewBlocks)
    console.log(`Đã thêm ${uniqueNewBlocks.length} block lv2 vào toggle lv1.`)
    return rs
  }

  //Can override
  async _updateBlockText (block) {
    return block
  }

  async _removeChildren (block) {
    if (!block.has_children) return block
    const svc = new EcoNotionServiceBuildBlockToggle()
    return await svc.deleteAllChildBlocks(block.id)
  }

  async #getLv1Block () {
    const me = this
    let block = await me.#findLv1Block()
    if (block) {
      //console.log(`--- Found Lv1 block: id = ${block.id} ---`)
      if (me._isResetRichText) {
        block = await me._updateBlockText(block)
      }

      if (me._isResetChildren) {
        block = await me._removeChildren(block)
      }
    } else {
      //console.log(`--- Need create nav1 lv1 block ---`)
      block = await me._createLv1ToggleBlock()
    }
    //console.log(`🪭 --- getLv1Block result ---`, block)
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

    const lv2ExistingTargetBlocks = lv2ExistingAllBlocks.filter(block => {
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
      const isInclude = newCompareData.some(item => item.text === combinedText)
      const match = newCompareData.find(item => item.text === combinedText)
      const blockData = match ? match.data : null
      //console.log('isInclude', isInclude)
      //console.log('blockData > children', blockData.toggle.children)
      if (isInclude && blockData.toggle.children)
        block.newChildren = blockData.toggle.children
      return isInclude
    })
    //console.log('$$$ existingBlocks (lv2)', existingBlocks)
    return {
      lv2UniqueNewBlocks: lv2UniqueNewBlocks,
      lv2ExistingTargetBlocks: lv2ExistingTargetBlocks,
    }
  }

  async _getLv2Blocks () {
    throw new Error('Need implement _getLv2Blocks')
  }

  async _onExecuteDone (lv1BlockId) {
    throw new Error(`Need implement _onExecuteDone, lv1BlockId: ${lv1BlockId}`)
  }
  async _buildLv3BlocksForExtgLv2Blocks (lv1BlockId, lv2ExtgBlocks) {
    console.log(`Không có block lv3 cho block lv1: ${lv1BlockId}...`)
  }
  async execute () {
    const me = this
    const isResetChildren = me._isResetChildren
    const toggleBlock = await me.#getLv1Block()
    if (!toggleBlock) return null
    const lv1BlockId = toggleBlock.id
    const newLv2Blocks = me._getLv2Blocks(lv1BlockId)
    //console.log('newLv2Blocks', newLv2Blocks)
    // Lọc các block mới không trùng text
    const { lv2UniqueNewBlocks, lv2ExistingTargetBlocks } = isResetChildren
      ? { lv2UniqueNewBlocks: newLv2Blocks, lv2ExistingTargetBlocks: [] }
      : await me.#getUniqueNewOrExistingBlocks(lv1BlockId, newLv2Blocks)

    const hasNewLv2Blocks = lv2UniqueNewBlocks.length !== 0
    const hasExistingLv2Blocks = lv2ExistingTargetBlocks.length !== 0
    if (hasExistingLv2Blocks) {
      if (isResetChildren) {
        console.log(
          'Không xử lý các blocks lv2 đã tồn tại trước đó vì isResetChildren = true '
        )
      } else {
        await me._buildLv3BlocksForExtgLv2Blocks(lv1BlockId, lv2ExistingTargetBlocks)
      }
    }
    if (hasNewLv2Blocks) {
      // Thêm block mới không trùng lv2 có bao gồm lv3
      await me.#appendLevel2Block(lv1BlockId, lv2UniqueNewBlocks)
    } else {
      console.log('Không có các blocks mới lv2 để thêm.')
    }
   
    await me._onExecuteDone(lv1BlockId)
    return lv2UniqueNewBlocks
  }
}
