import { NotionBuilderLv4DataBase as Base } from './notion-builder-lv4-data-base.js'
import { EcoTasksLinks as eObjLnk } from '../../../tasks/notion-task-block-links.js'
import { EcoNotionBuilderRichTextLinks } from '../../blocks/notion-builder-rich-text-links.js'
import { EcoNotionBuilderBlockParagraph } from '../../blocks/notion-builder-block-paragraph.js'

export class NotionBuilderLv4DataLearnLinks extends Base {
  
  constructor (logConfig = 'NotionBuilderLv4DataLearnLinks') {
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

  build () {
    const me = this
    const targetPageId = me._targetPageId
    const id = me._cleanId(targetPageId)
    const arrObjects = [
      eObjLnk.getRelatedLearnLinkObject(id),
      eObjLnk.getRelatedTestLinkObject(id),
    ]
    this._resultBlock = me.#getLinksLv4ToggleBlock(arrObjects)
    return me
  }
 
}
