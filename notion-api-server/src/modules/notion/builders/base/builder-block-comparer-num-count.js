import { EcoBuilderBlockComparerBase as Base } from './builder-block-comparer-base.js'
import { EcoTextUtil as uTxt } from '../../../../utils/text.js'
import { EcoNotionTaskBlockMapText as mt } from '../../tasks/notion-task-block-map-text.js'

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
      me.#getDefaultInputCompareCountNumberString()
    return me
  }
  isMatch (block) {
    const me = this
    const inputCompareCountNumberText = me._inputCompareCountNumberText
    return me.#isMatchCountNumberString(block, inputCompareCountNumberText)
  }
  #getDefaultInputCompareCountNumberString () {
    const me = this
    const displayText = me._displayText()
    //console.log('🎋 displayText', displayText)
    return uTxt.getCountNumberString(displayText)
  }
  #isMatchCountNumberString (block, inputCompareCountNumberText) {
    const me = this
    const existingCompareText = me.#getRichTextCountNumberString(block)
    return me._compareTextAndText(
      inputCompareCountNumberText,
      existingCompareText
    )
  }
  #getRichTextCountNumberString (block) {
    //const me = this
    const richTexts = (block ? block[block.type]?.rich_text : []) || []
    //console.log('🐸 #getRichTextCountNumberString', richTexts)

    const plainText = mt.getBlockDisplayTextFromNotionRichTextArr(richTexts)
    //console.log('🌽 plainText', plainText)
    //console.log('💎 rich_text', block.toggle.rich_text)
    const rsText = uTxt.getCountNumberString(plainText)
    //console.log('> existingCompareEmojiText', existingCompareEmojiText)

    return rsText
  }
}
