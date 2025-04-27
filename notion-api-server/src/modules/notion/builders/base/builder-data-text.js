import { EcoBase } from '../../../../base/eco-base.js'
import { EcoNotionTaskBlockMapText as mt} from '../../tasks/notion-task-block-map-text.js'
export class EcoNotionBuilderDataText extends EcoBase {
  constructor (logCfg) {
    super(logCfg)
  }

  //    getDisplayText () {
  //       const me = this
  //       const items = me.getMenuItemData()
  //       const result = items.map(item => `${item.emoji} ${item.label}`).join(' | ')
  //       return result
  //     }

  //Need Override
  getDisplayText () {
    const me = this
    const richTextArray = me.getRichTextData()
    const plainText = mt.getBlockDisplayTextFromInputRichTextArr(richTextArray)
    return plainText
  }
  getTextLinks () {
    const me = this
    const richTextArray = me.getRichTextData()
    const arr = mt.getTextLinksFromRichText(richTextArray)
    return arr
  }
  //Need Override
  getRichTextData () {
    throw new Error('Need implement getRichTextData')
  }
}
