//import { Lv0Builder } from './lv0Builder.js'
import { EcoBuilderBlocksMaster as Base } from './builder-blocks-master.js'
import { NotionMissionBlocksCompare } from './notion-mission-blocks-compare.js'
import { EcoTextUtil as uTxt } from '../../../../utils/text.js'

export class EcoNotionBuilderLv2Master extends Base {
  _pageId
  constructor (logCfg) {
    super(logCfg)
  }
  setPageId (pageId) {
    const me = this
    me._pageId = pageId
    return me
  }

  setBuildCfg (buildCfg) {
    const me = this
    me._buildCfg = buildCfg
    return me
  }

  get _isResetChildren () {
    return this._buildCfg?.isResetChildren ?? false
  }

  
  async build(lv, block, rs) {
    const me = this
    const lv1BlockId = block.id
    const isResetChildren = me._isResetChildren
    const newLv2Blocks = await me._getInputBlocks(block)

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
        await me._buildLv3BlocksForExtgLv2Blocks(
          lv1BlockId,
          lv2ExistingTargetBlocks
        )
      }
    }
    if (hasNewLv2Blocks) {
      // Thêm block mới không trùng lv2 có bao gồm lv3
      await me.#appendLevel2Block(lv1BlockId, lv2UniqueNewBlocks)
    } else {
      console.log('Không có các blocks mới lv2 để thêm.')
    }
  }
  async #getUniqueNewOrExistingBlocks (blockId, newLv2Blocks) {
    const me = this
    const nqc = this._nqc
    const reason = 'Lv1Builder > #getUniqueNewOrExistingBlocks'
    const lv2ExistingAllBlocks = await nqc.getAllChildrenById(reason, blockId)

    const cs = new NotionMissionBlocksCompare()

    const rs = cs.compareNotionBlocks(newLv2Blocks, lv2ExistingAllBlocks)
    me._logLines('🪸 compareNotionBlocks result: ', rs)
    await me.#removeLv2Blocks(rs.needRemoveItems)
    // block = await me._removeChildren(block)

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
        .map(rt => uTxt.normalizeText(rt.text.content))
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
        .map(rt => uTxt.normalizeText(rt.text.content))
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

  async #appendLevel2Block (blockId, uniqueNewBlocks) {
    const svc = new EcoNotionServiceBuildBlockToggle()
    const rs = await svc.appendChildren(blockId, uniqueNewBlocks)
    console.log(`Đã thêm ${uniqueNewBlocks.length} block lv2 vào toggle lv1.`)
    return rs
  }

  async #removeLv2Blocks (blocks) {
    //const me = this
    if (!blocks?.length) return
    if (!blocks || blocks.length < 1) return
    const svc = new EcoNotionServiceBuildBlockToggle()
    for (const block of blocks) {
      return await svc.deleteBlock(block.id)
    }
  }

  async #getNewCompareData (newLv2Blocks) {
    const me = this
    const existingTexts = newLv2Blocks.flatMap(block => {
      const richText = block[block.type]?.rich_text
      if (!richText) return []
      return richText
        .map(rt => {
          const normalized = uTxt.normalizeText(rt.text.content)
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

  async #getExistingTexts (toggleChildrenRes) {
    const me = this
    // Lấy danh sách block con hiện tại của toggle block

    const existingTexts = new Set(
      toggleChildrenRes
        .flatMap(block => {
          const richText = block[block.type]?.rich_text
          if (!richText) return []
          return richText.map(rt => uTxt.normalizeText(rt.plain_text))
        })
        .filter(text => text) // loại bỏ undefined/null
    )
    return existingTexts
  }
}
