import { NotionBuilderLv4ItemBase as Base } from './notion-builder-lv4-item-base.js'
import { EcoNotionBuilderBlockParagraph } from '../../blocks/notion-builder-block-paragraph.js'
import { EcoObjLinkHelper as eObjLnk } from '../../../../eco/helpers/eco-obj-lnk-helper.js'
import { EcoNotionBuilderRichTextLinks } from '../../blocks/notion-builder-rich-text-links.js'
import { EcoNotionMissionBlockCompare as CompareService } from '../../../missions/notion-mission-block-compare.js'
export class NotionBuilderLv4ItemLearnLinks extends Base {

  constructor (logConfig = 'NotionBuilderLv4ItemSingleLink') {
    super(logConfig)
  }

  #getLinksLv4ToggleBlock (items) {
    const me = this
    const helper = new EcoNotionBuilderRichTextLinks()
    //const me = this
    //let idx = 0
    const richText = helper.getLinksRichText(items, me._linksDivider)

    const pb = new EcoNotionBuilderBlockParagraph()
    const blockLv4 = richText.length
      ? pb.setRichTextArray(richText).oBlockRaw
      : null
    return blockLv4
  }
  async #appendLinksToggleBlock (blockLv3Id, arrObjects) {
    const me = this
    try {
      const blockLv4 = me.#getLinksLv4ToggleBlock(arrObjects)
      return blockLv4 ? await me._appendToggleBlock(blockLv3Id, blockLv4) : null
    } catch (error) {
      console.error('❌ Lỗi khi thêm text vào toggle block:', error)
    }
  }
  async #addTextLinks (blockLv3Id, children, arrObjects) {
    const me = this
    const svc = new CompareService()
    const rawText = eObjLnk.getRawInputCompareText(arrObjects)
    const hasChild = svc.isBlockFound(children, rawText, me._linksDivider)
    if (hasChild) {
      console.log(`🪶 Block ${blockLv3Id} đã tồn tại block con ${rawText}!`)
    } else {
      await me.#appendLinksToggleBlock(blockLv3Id, arrObjects)
    }
  }
  async build () {
    const me = this
    const targetPageId = me._targetPageId
    const blockLv3Id = me._blockLv3Id
    const children = me._children
    const id = me._cleanId(targetPageId)
    const arrObjects = [
      eObjLnk.getRelatedLearnLinkObject(id),
      eObjLnk.getRelatedTestLinkObject(id),
    ]
    return await me.#addTextLinks(blockLv3Id, children, arrObjects)
  }
}
