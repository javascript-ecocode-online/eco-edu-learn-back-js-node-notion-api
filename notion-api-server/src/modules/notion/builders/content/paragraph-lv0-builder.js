import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoNotionParagraphLv1Builder as BlockBuilder } from './paragraph-lv1-builder.js'
export class EcoNotionParagraphLv0Builder extends Base {
  constructor (pageId, pageBlocks) {
    super('EcoNotionParagraphLv0Builder', pageId)
    this._pageId = pageId
    this._pageBlocks = pageBlocks
  }

  async execute () {
    const me = this
    const pageId = me._pageId
    const blocks = me._pageBlocks
    const blocksWithFireToggle = blocks.filter(block => {
      const isToggleType =
        block.type === 'toggle' ||
        (['heading_1', 'heading_2', 'heading_3'].includes(block.type) &&
          block[block.type]?.is_toggleable)

      if (isToggleType && block[block.type]?.rich_text?.length) {
        const text = block[block.type].rich_text
          .map(rt => rt.plain_text)
          .join('')
        return text.trim().endsWith('🔥')
      }

      return false
    })
    const builtBlocks = []
    for (const block of blocksWithFireToggle) {
      const blockId = block.id
      console.log(`🏝️ -- Start build block ${blockId}...`)
      const bb = new BlockBuilder(
        pageId,
        block
      )
      const buildResult = await bb.execute()
      if(buildResult) builtBlocks.push(buildResult)
      console.log(`🏝️ -- Build block ${blockId} done!`)
    }

    return builtBlocks
  }
}
