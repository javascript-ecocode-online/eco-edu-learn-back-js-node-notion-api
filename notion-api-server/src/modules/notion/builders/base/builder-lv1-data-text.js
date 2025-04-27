import { EcoNotionBuilderDataText as Base} from './builder-data-text.js'

import { EcoNotionBuilderRichTextLinks } from '../blocks/notion-builder-rich-text-links.js'

export class EcoNotionBuilderLv1DataText extends Base {
  constructor (logCfg) {
    super(logCfg)
  }

  getMenuItemData () {
    throw new Error('Need implement _getMenuItemData')
  }
 
  getRichTextData () {
    const me = this
    const helper = new EcoNotionBuilderRichTextLinks()
    const items = me.getMenuItemData()
    const richText = helper.getLinksRichText(items, me._linksDivider)
    return richText
  }
}
