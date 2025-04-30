import { EcoBuilderBlockComparerBase as Base } from './builder-block-comparer-base.js'
import { EcoTextUtil as uTxt } from '../../../../utils/text.js'
import { EcoNotionTaskBlockMapText as mt } from '../../tasks/notion-task-block-map-text.js'

export class EcoBuilderBlockComparerTextRaw extends Base {
  _inputCompareText
  constructor (
    textBuilder,
    logConfig = {
      isDebug: false,
      name: 'EcoBuilderBlockComparerTextRaw',
      level: 'info',
    }
  ) {
    super(textBuilder, logConfig)
  }
//_txtc
  prepare () {
    const me = this
    me._inputCompareText = me.#getDefaultInputCompareString()
   
    return me
  }

  isMatch(block){
    const me = this
    const inputCompareText = me._inputCompareText
    return me.#isMatchRawContent(block, inputCompareText)
  }

  #getDefaultInputCompareString () {
    const me = this
    const displayText = me._displayText()
    //console.log('🎋 displayText', displayText)
    return uTxt.normalizeText(displayText)
  }

  #isMatchRawContent (block, inputCompareText) {
    const me = this
    const existingCompareText = me.#getDefaultRichTextCompareString(block)
    // console.log()
     //console.log('🥖 inputCompareText: ', inputCompareText)
     //console.log('🥖 existingCompareText: ', existingCompareText)
    // console.log()
    return me._compareTextAndText(inputCompareText, existingCompareText)
  }

  #getDefaultRichTextCompareString (block) {
      //const me = this
      const richTexts = (block ? block[block.type]?.rich_text : []) || []
      const plainText = mt.getBlockDisplayTextFromNotionRichTextArr(richTexts)
      //console.log('🌽 plainText', plainText)
      //console.log('💎 rich_text', block.toggle.rich_text)
      const rsText = uTxt.normalizeText(plainText)
      //console.log('🌱 #getDefaultRichTextCompareString', existingCompareText)
      return rsText
    }
}
