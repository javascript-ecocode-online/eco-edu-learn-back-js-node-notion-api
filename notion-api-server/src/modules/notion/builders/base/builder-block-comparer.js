import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoTextUtil as uTxt } from '../../../../utils/text.js'
import { EcoNotionTaskBlockMapText as mt } from '../../tasks/notion-task-block-map-text.js'

export class EcoBuilderBlockComparer extends Base {
  _textBuilder
  _inputCompareText
  _inputCompareLinks
  _inputCompareEmojiText
  constructor (
    logConfig = { isDebug: false, name: 'EcoBuilderBlockQuery', level: 'info' }
  ) {
    super(logConfig)
  }

  setTextBuilder (textBuilder) {
    this._textBuilder = textBuilder
    return this
  }

  prepare () {
    throw new Error('🩸 EcoBuilderBlockComparer > prepare need implement!')
  }

  isMatchContent (block) {
    throw new Error(
      '🩸 EcoBuilderBlockComparer > isMatchContent need implement!'
    )
  }

  needUpdateRichText (block) {
    throw new Error(
      '🩸 EcoBuilderBlockComparer > needUpdateRichText need implement!'
    )
  }

  //Can override
  _prepareRawTextOnly () {
    const me = this
    me._inputCompareText = me.#getDefaultInputCompareString()
    return me
  }
  _prepareEmojiTextOnly () {
    const me = this
    me._inputCompareEmojiText = me.#getDefaultInputCompareEmojiString()
    //console.log('me._inputCompareEmojiText', me._inputCompareEmojiText)
    return me
  }
  _prepareInputLinksOnly () {
    const me = this
    me._inputCompareLinks = me.#inputLinks()
    return me
  }
  _prepare_Text_Links () {
    return this._prepareRawTextOnly()._prepareInputLinksOnly()
  }
  _prepare_Text_Emoji () {
    return this._prepareRawTextOnly()._prepareEmojiTextOnly()
  }
  _prepare_Text_Emoji_Links () {
    return this._prepareRawTextOnly()._prepareInputLinksOnly()._prepareEmojiTextOnly()
  }
  //Can override
  _isMatchRawTextOnly (block) {
    const me = this
    const inputCompareText = me._inputCompareText
    return me.#isMatchRawContent(block, inputCompareText)
  }

  _isMatchTextLinksOnly (block) {
    const me = this
    const inputCompareLinks = me._inputCompareLinks
    return me.#isMatchTextLinks(block, inputCompareLinks)
  }
  _isMatchRawEmojiOnly (block) {
    const me = this
    const inputCompareEmojiText = me._inputCompareEmojiText
    return me.#isMatchEmojiString(block, inputCompareEmojiText)
  }
  #isMatchTextLinks (block, inputCompareLinks) {
    const me = this
    const existingCompareTextLinks = me.#getDefaultRichTextCompareLinks(block)
    return me.#compareLinksAndLinks(inputCompareLinks, existingCompareTextLinks)
  }
  _isMatch_RawText_OrLinks (block) {
    const me = this
    const isMatchRawTextOnly = me._isMatchRawTextOnly(block)
    const isMatchTextLinksOnly = me._isMatchTextLinksOnly(block)
    return isMatchRawTextOnly || isMatchTextLinksOnly
  }
  _isMatch_RawText_OrEmoji (block) {
    const me = this
    const isMatchRawTextOnly = me._isMatchRawTextOnly(block)
    const isMatchEmojiLinksOnly = me._isMatchRawEmojiOnly(block)
    return isMatchRawTextOnly || isMatchEmojiLinksOnly
  }
  _isMatch_RawText_OrLinks_OrEmoji (block) {
    const me = this
    const isMatchRawTextOnly = me._isMatchRawTextOnly(block)
    const isMatchTextLinksOnly = me._isMatchTextLinksOnly(block)
    const isMatchEmojiLinksOnly = me._isMatchRawEmojiOnly(block)
    //console.log('🌙 isMatchRawTextOnly', isMatchRawTextOnly)
    //console.log('🌙 isMatchTextLinksOnly', isMatchTextLinksOnly)
    //console.log('🌙 isMatchEmojiLinksOnly', isMatchEmojiLinksOnly)
    return isMatchRawTextOnly || isMatchTextLinksOnly || isMatchEmojiLinksOnly
  }
  _isEqual_RawText_Links (block) {
    const me = this
    const isMatchRawTextOnly = me._isMatchRawTextOnly(block)
    const isMatchTextLinksOnly = me._isMatchTextLinksOnly(block)
    return isMatchRawTextOnly && isMatchTextLinksOnly
  }
  _isEqual_RawText_Emoji (block) {
    const me = this
    const isMatchRawTextOnly = me._isMatchRawTextOnly(block)
    const isMatchEmojiLinksOnly = me._isMatchRawEmojiOnly(block)
    return isMatchRawTextOnly && isMatchEmojiLinksOnly
  }
  _isEqual_RawText_Links_Emoji (block) {
    const me = this
    const isMatchRawTextOnly = me._isMatchRawTextOnly(block)
    const isMatchTextLinksOnly = me._isMatchTextLinksOnly(block)
    const isMatchEmojiLinksOnly = me._isMatchRawEmojiOnly(block)
    return isMatchRawTextOnly && isMatchTextLinksOnly && isMatchEmojiLinksOnly
  }
  #displayText () {
    const me = this
    const textBuilder = me._textBuilder
    return textBuilder?.getDisplayText()
  }
  #inputLinks () {
    const me = this
    const textBuilder = me._textBuilder
    return textBuilder?.getTextLinks()
  }
  #getDefaultInputCompareString () {
    const me = this
    const displayText = me.#displayText()
    //console.log('🎋 displayText', displayText)
    return uTxt.normalizeText(displayText)
  }
  #getDefaultInputCompareEmojiString () {
    const me = this
    const displayText = me.#displayText()
    //console.log('🎋 displayText', displayText)
    return uTxt.getEmojiString(displayText)
  }
  #getDefaultRichTextCompareString (block) {
    //const me = this
    const richTexts = (block? block[block.type]?.rich_text: []) || []
    const plainText = mt.getBlockDisplayTextFromNotionRichTextArr(richTexts)
    //console.log('🌽 plainText', plainText)
    //console.log('💎 rich_text', block.toggle.rich_text)
    const existingCompareText = uTxt.normalizeText(plainText)
    //console.log('🌱 #getDefaultRichTextCompareString', existingCompareText)
    return existingCompareText
  }

  #getRichTextEmojiString (block) {
    //const me = this
    const richTexts =  (block? block[block.type]?.rich_text: []) || []
    //console.log('🐸 #getRichTextEmojiString', richTexts)

    const plainText = mt.getBlockDisplayTextFromNotionRichTextArr(richTexts)
    //console.log('🌽 plainText', plainText)
    //console.log('💎 rich_text', block.toggle.rich_text)
    const existingCompareEmojiText = uTxt.getEmojiString(plainText)
    //console.log('> existingCompareEmojiText', existingCompareEmojiText)

    return existingCompareEmojiText
  }

  #getDefaultRichTextCompareLinks (block) {
    //const me = this
    const richTexts = block.toggle.rich_text || []
    const arrLinks = mt.getTextLinksFromRichText(richTexts)

    return arrLinks
  }

  #compareTextAndText (inputCompareText, existingCompareText) {
    // if(this._logName === 'EcoNotionBuilderNav1Lv2Comparer'){
    //     console.log(
    //         '🪭 _compareTextAndText',
    //          this._logName
    //        )
    //        console.log('- ipt: ', inputCompareText)
    //        console.log('- ext: ', existingCompareText)
    // }
    
    return inputCompareText === existingCompareText
  }

   #cleanUrl(url) {
    return url.replace(/\/\?/, '?'); // thay "/?" thành "?"
  }

  #compareLinksAndLinks (inputCompareLinks, existingCompareTextLinks) {
    const me = this
    // console.log(
    //   '💥 compareLinksAndLinks',
    //   'inputCompareLinks vs existingCompareTextLinks'
    // )
    // console.log('- ipt: ', inputCompareLinks)
    // console.log('- ext: ', existingCompareTextLinks)
    const arr1 = inputCompareLinks
    const arr2 = existingCompareTextLinks
    if (arr1.length !== arr2.length) return false // khác độ dài => khác chắc chắn

    for (let i = 0; i < arr1.length; i++) {
      if (me.#cleanUrl(arr1[i]) !== me.#cleanUrl(arr2[i])) {
        //console.log('- compareLinksAndLinks diff: ')
        //console.log(arr1[i], arr2[i])
        return false // chỉ cần khác 1 phần tử => khác
      }
    }
    //console.log('- rs: ', true)
    return true
  }

  #isMatchRawContent (block, inputCompareText) {
    const me = this
    const existingCompareText = me.#getDefaultRichTextCompareString(block)
    return me.#compareTextAndText(inputCompareText, existingCompareText)
  }

  #isMatchEmojiString (block, inputCompareEmojiText) {
    const me = this
    const existingCompareText = me.#getRichTextEmojiString(block)
    return me.#compareTextAndText(inputCompareEmojiText, existingCompareText)
  }
}
//#getRichTextEmojiString