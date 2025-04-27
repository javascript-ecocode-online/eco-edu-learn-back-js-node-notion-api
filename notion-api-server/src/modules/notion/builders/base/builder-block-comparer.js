import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoBuilderBlockComparerTextEmojis } from './builder-block-comparer-text-emojis.js'
import { EcoBuilderBlockComparerTextRaw } from './builder-block-comparer-text-raw.js'
import { EcoBuilderBlockComparerTextLinks } from './builder-block-comparer-text-links.js'
import { EcoBuilderBlockComparerNumCount } from './builder-block-comparer-num-count.js'
import { EcoBuilderBlockComparerTextSpecial } from './builder-block-comparer-text-special.js'
export class EcoBuilderBlockComparer extends Base {
  #txtc
  #emjc
  #lnkc
  #numc
  #spec
  _textBuilder
  
  
  constructor (
    logConfig = { isDebug: false, name: 'EcoBuilderBlockQuery', level: 'info' }
  ) {
    super(logConfig)
  }
  
  get _txtc(){
    const me = this
    if(!me.#txtc) me.#txtc = new EcoBuilderBlockComparerTextRaw(me._textBuilder)
    return me.#txtc
  }

  get _emjc(){
    const me = this
    if(!me.#emjc) me.#emjc = new EcoBuilderBlockComparerTextEmojis(me._textBuilder)
    return me.#emjc
  }

  get _lnkc(){
    const me = this
    if(!me.#lnkc) me.#lnkc = new EcoBuilderBlockComparerTextLinks(me._textBuilder)
    return me.#lnkc
  }

  get _numc(){
    const me = this
    if(!me.#numc) me.#numc = new EcoBuilderBlockComparerNumCount(me._textBuilder)
    return me.#numc
  }

  get _spec(){
    const me = this
    if(!me.#spec) me.#spec = new EcoBuilderBlockComparerTextSpecial(me._textBuilder)
    return me.#spec
  }

  setTextBuilder (textBuilder) {
    const me = this
    me._textBuilder = textBuilder
    return me
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
  #prepareRawText () {
    const me = this
    me._txtc.prepare()
    return me
  }
  #prepareEmojis () {
    const me = this
    me._emjc.prepare()
    return me
  }
  #prepareTextLinks () {
    const me = this
    me._lnkc.prepare()
    return me
  }
  #prepareCountNumber () {
    const me = this
    me._numc.prepare()
    return me
  }
  #prepareSpecialText(){
    const me = this
    me._spec.prepare()
    return me
  }
  _prepare_Text_Links () {
    return this.#prepareRawText().#prepareTextLinks()
  }
  _prepare_Text_Emoji () {
    return this.#prepareRawText().#prepareEmojis()
  }
  _prepare_Text_Emoji_Count () {
    return this.#prepareRawText()
      .#prepareEmojis()
      .#prepareCountNumber()
  }
  _prepare_Text_Emoji_Links () {
    return this.#prepareRawText()
      .#prepareTextLinks()
      .#prepareEmojis()
  }
  _prepare_Text_Emoji_Links_Special () {
    return this.#prepareRawText()
      .#prepareTextLinks()
      .#prepareEmojis().#prepareSpecialText()
  }
  
  _isMatch_RawText_OrLinks (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchTextLinksOnly = me._lnkc.isMatch(block)
    return isMatchRawTextOnly || isMatchTextLinksOnly
  }

  _isMatch_RawText_OrEmoji (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchEmojisOnly = me._emjc.isMatch(block)
    return isMatchRawTextOnly || isMatchEmojisOnly
  }

  _isMatch_RawText_OrLinks_OrEmoji (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchTextLinksOnly = me._lnkc.isMatch(block)
    const isMatchEmojisOnly = me._emjc.isMatch(block)
    //console.log('🌙 isMatchRawTextOnly', isMatchRawTextOnly)
    //console.log('🌙 isMatchTextLinksOnly', isMatchTextLinksOnly)
    //console.log('🌙 isMatchEmojiLinksOnly', isMatchEmojiLinksOnly)
    return isMatchRawTextOnly || isMatchTextLinksOnly || isMatchEmojisOnly
  }

  _isEqual_RawText_Links (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchTextLinksOnly = me._lnkc.isMatch(block)
    return isMatchRawTextOnly && isMatchTextLinksOnly
  }

  _isEqual_RawText_Emoji (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchEmojisOnly = me._emjc.isMatch(block)
    return isMatchRawTextOnly && isMatchEmojisOnly
  }

  _isEqual_RawText_Emoji_Number (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchEmojisOnly = me._emjc.isMatch(block)
    const isMatchCountNumberOnly = me._numc.isMatch(block)
    return isMatchRawTextOnly && isMatchEmojisOnly && isMatchCountNumberOnly
  }

  _isEqual_RawText_Links_Emoji (block) {
    const me = this
    const isMatchRawText = me._txtc.isMatch(block)
    const isMatchTextLinks = me._lnkc.isMatch(block)
    const isMatchEmojis = me._emjc.isMatch(block)
    return isMatchRawText && isMatchTextLinks && isMatchEmojis
  }

  _isEqual_RawText_Links_Emoji_Special (block) {
    const me = this
    const isMatchRawText = me._txtc.isMatch(block)
    const isMatchTextLinks = me._lnkc.isMatch(block)
    const isMatchEmojis = me._emjc.isMatch(block)
    const isMatchSpecial = me._spec.isMatch(block)
    return isMatchRawText && isMatchTextLinks && isMatchEmojis && isMatchSpecial
  }
}