import { EcoBuilderBlockComparerBase as Base } from './builder-block-comparer-base.js'
import { EcoTextUtil as uTxt } from '../../../../utils/text.js'
import { EcoNotionTaskBlockMapText as mt } from '../../tasks/notion-task-block-map-text.js'

export class EcoBuilderBlockComparerTextEmojis extends Base {
  _inputCompareEmojiText
  constructor (
    textBuilder,
    logConfig = {
      isDebug: false,
      name: 'EcoBuilderBlockComparerTextEmojis',
      level: 'info',
    }
  ) {
    super(textBuilder, logConfig)
  }

  prepare () {
    const me = this
    me._inputCompareEmojiText = me.#getDefaultInputCompareEmojiString()
    return me
  }

  isMatch(block){
    const me = this
    const inputCompareEmojiText = me._inputCompareEmojiText
    return me.#isMatchEmojiString(block, inputCompareEmojiText)
  }

  #getDefaultInputCompareEmojiString () {
    const me = this
    const displayText = me._displayText()
    //console.log('💥 emoji displayText 1', displayText)
    return uTxt.getEmojiString(displayText)
  }


  #isMatchEmojiString (block, inputCompareEmojiText) {
    const me = this
    const existingCompareText = me.#getRichTextEmojiString(block)
    //console.log('💥 emoji isMatchEmojiString')
    //console.log(inputCompareEmojiText, existingCompareText)
    return me._compareTextAndText(inputCompareEmojiText, existingCompareText)
  }

  #getRichTextEmojiString (block) {
      //const me = this
      const richTexts = (block ? block[block.type]?.rich_text : []) || []
      //console.log('🐸 #getRichTextEmojiString', richTexts)
  
      const plainText = mt.getBlockDisplayTextFromNotionRichTextArr(richTexts)
      //console.log('💥 emoji displayText 2', plainText)
      //console.log('🌽 plainText', plainText)
      //console.log('💎 rich_text', block.toggle.rich_text)
      const rsText = uTxt.getEmojiString(plainText)
      //console.log('> existingCompareEmojiText', existingCompareEmojiText)
  
      return rsText
    }
}
