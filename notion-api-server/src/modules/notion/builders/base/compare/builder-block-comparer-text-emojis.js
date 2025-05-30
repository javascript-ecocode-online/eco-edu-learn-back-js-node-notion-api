import { EcoBuilderBlockComparerBase as Base } from './builder-block-comparer-base.js'
import { EcoTextUtil as uTxt } from '../../../../../utils/text.js'
import { EcoNotionTaskBlockMapText as mt } from '../../../tasks/notion-task-block-map-text.js'

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
    me._inputCompareEmojiText = me.#getIText()
    return me
  }

  isMatch (block) {
    const me = this
    const inputCompareEmojiText = me._inputCompareEmojiText
    return me.#isMatchEmojiString(block, inputCompareEmojiText)
  }

  #getIText () {
    const me = this
    const displayText = me._displayText()
    const rs = uTxt.getEmojiString(displayText)
    //console.log('🛸 iEmoji: ', rs)
    return rs
  }

  #isMatchEmojiString (block, iText) {
    const me = this
    const eText = me.#getEText(block)
    const rs = me._compareTextAndText(iText, eText)
    if (rs) {
      //console.log('> blockId: ', block.id)
      //console.log('💥 emoji isMatchEmojiString',  block[block.type].rich_text)
      
      //console.log('> iText: ', iText)
      //console.log('> eText: ', eText)
    }
    return rs
  }

  #getEText (block) {
    //const me = this
    const richTexts = (block ? block[block.type]?.rich_text : []) || []
    //console.log('🐸 #getRichTextEmojiString', richTexts)

    const plainText = mt.getBlockDisplayTextFromNotionRichTextArr(richTexts)
    //console.log('> plainText', plainText)
    //console.log('🌽 plainText', plainText)
    //console.log('💎 rich_text', block.toggle.rich_text)
    const rsText = uTxt.getEmojiString(plainText)
    //console.log('> existingCompareEmojiText', existingCompareEmojiText)
    //console.log('🛸 eEmoji: ', rsText)

    return rsText
  }
}
