import { EcoBuilderBlockComparerBase as Base } from './builder-block-comparer-base.js'
import { EcoTextUtil as uTxt } from '../../../../../utils/text.js'
import { EcoNotionTaskBlockMapText as mt } from '../../../tasks/notion-task-block-map-text.js'

export class EcoBuilderBlockComparerNumCount extends Base {
  _inputCompareCountNumberText
  constructor (
    textBuilder,
    logConfig = {
      isDebug: false,
      name: 'EcoBuilderBlockComparerNumCount',
      level: 'info',
    }
  ) {
    super(textBuilder, logConfig)
  }
  //_numc
  prepare () {
    const me = this
    me._inputCompareCountNumberText =
      me.#getIText()
    return me
  }
  isMatch (block) {
    const me = this
    const inputCompareCountNumberText = me._inputCompareCountNumberText
    return me.#isMatchCountNumberString(block, inputCompareCountNumberText)
  }
  #getIText () {
    const me = this
    const displayText = me._displayText()
    
    //console.log('🎋 displayText', displayText)
    const rs = uTxt.getCountNumberString(displayText)
    //console.log('🛸 num count itext', rs)
    return rs
  }
  #isMatchCountNumberString (block, inputCompareCountNumberText) {
    const me = this
    const existingCompareText = me.#getEText(block)
    return me._compareTextAndText(
      inputCompareCountNumberText,
      existingCompareText
    )
  }
  #getEText (block) {
    //const me = this
    const richTexts = (block ? block[block.type]?.rich_text : []) || []
    //console.log('🐸 #getRichTextCountNumberString', richTexts)

    const plainText = mt.getBlockDisplayTextFromNotionRichTextArr(richTexts)
    //console.log('🌽 plainText', plainText)
    //console.log('💎 rich_text', block.toggle.rich_text)
    const rsText = uTxt.getCountNumberString(plainText)
    //console.log('> existingCompareEmojiText', existingCompareEmojiText)
    //console.log('🛸 num count etext', rsText)
    return rsText
  }
}
