import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoBuilderBlockComparerTextEmojis } from './builder-block-comparer-text-emojis.js'
import { EcoBuilderBlockComparerTextRaw } from './builder-block-comparer-text-raw.js'
import { EcoBuilderBlockComparerTextLinks } from './builder-block-comparer-text-links.js'
import { EcoBuilderBlockComparerNumCount } from './builder-block-comparer-num-count.js'
import { EcoBuilderBlockComparerTextSpecial } from './builder-block-comparer-text-special.js'
import { EcoBuilderBlockComparerTextNum } from './builder-block-comparer-text-num.js'
export class EcoBuilderBlockComparer extends Base {
  #txtc
  #emjc
  #lnkc
  #numc
  #spec
  #txnc
  _textBuilder

  #resetParts () {
    const me = this
    me.#txtc = null
    me.#emjc = null
    me.#lnkc = null
    me.#numc = null
    me.#spec = null
    me.#txnc = null
    return me
  }

  constructor (
    logConfig = {
      isDebug: false,
      name: 'EcoBuilderBlockComparer',
      level: 'info',
    }
  ) {
    super(logConfig)
  }

  get _txtc () {
    const me = this
    if (!me.#txtc)
      me.#txtc = new EcoBuilderBlockComparerTextRaw(me._textBuilder)
    return me.#txtc
  }

  get _emjc () {
    const me = this
    if (!me.#emjc)
      me.#emjc = new EcoBuilderBlockComparerTextEmojis(me._textBuilder)
    return me.#emjc
  }

  get _lnkc () {
    const me = this
    if (!me.#lnkc)
      me.#lnkc = new EcoBuilderBlockComparerTextLinks(me._textBuilder)
    return me.#lnkc
  }

  get _numc () {
    const me = this
    if (!me.#numc)
      me.#numc = new EcoBuilderBlockComparerNumCount(me._textBuilder)
    return me.#numc
  }

  get _spec () {
    const me = this
    if (!me.#spec)
      me.#spec = new EcoBuilderBlockComparerTextSpecial(me._textBuilder)
    return me.#spec
  }

  get _txnc () {
    const me = this
    if (!me.#txnc)
      me.#txnc = new EcoBuilderBlockComparerTextNum(me._textBuilder)
    return me.#txnc
  }

  setTextBuilder (textBuilder) {
    const me = this
    me._textBuilder = textBuilder
    return me.#resetParts()
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
  #prepareSpecialText () {
    const me = this
    me._spec.prepare()
    return me
  }
  #prepareTextNum () {
    const me = this
    me._txnc.prepare()
    return me
  }
  _prepare_Text_Links () {
    return this.#prepareRawText().#prepareTextLinks()
  }
  _prepare_Text_Emoji () {
    return this.#prepareRawText().#prepareEmojis()
  }
  _prepare_Text_Emoji_Count () {
    return this.#prepareRawText().#prepareEmojis().#prepareCountNumber()
  }
  _prepare_Text_num_Emoji_Count () {
    return this.#prepareRawText()
      .#prepareEmojis()
      .#prepareCountNumber()
      .#prepareTextNum()
  }
  _prepare_Text_Emoji_Links () {
    return this.#prepareRawText().#prepareTextLinks().#prepareEmojis()
  }
  _prepare_Text_Emoji_Links_Special () {
    return this.#prepareRawText()
      .#prepareTextLinks()
      .#prepareEmojis()
      .#prepareSpecialText()
  }

  _isMatch_Links (block) {
    const me = this
    const isMatchTextLinksOnly = me._lnkc.isMatch(block)
    const rs = isMatchTextLinksOnly
    return rs
  }

  _isMatch_RawText_OrLinks (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchTextLinksOnly = me._lnkc.isMatch(block)
    const rs = isMatchRawTextOnly || isMatchTextLinksOnly
    return rs
  }

  _isMatch_RawText_OrEmoji (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchEmojisOnly = me._emjc.isMatch(block)
    //console.log('_isMatch_RawText_OrEmoji')
    //console.log(isMatchRawTextOnly, isMatchEmojisOnly)
    const rs = isMatchRawTextOnly || isMatchEmojisOnly
    return rs
  }

  _isMatch_RawText_OrLinks_OrEmoji (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchTextLinksOnly = me._lnkc.isMatch(block)
    const isMatchEmojisOnly = me._emjc.isMatch(block)
    //console.log('🪺 isMatchContent: ', block)

    const rs = isMatchRawTextOnly || isMatchTextLinksOnly || isMatchEmojisOnly
    // if (rs) {
    //   console.log('🌙 isMatchRawTextOnly', isMatchRawTextOnly)
    //   console.log('🌙 isMatchTextLinksOnly', isMatchTextLinksOnly)
    //   console.log('🌙 isMatchEmojiLinksOnly', isMatchEmojisOnly)
    //   console.log('🌙 _isMatch_RawText_OrLinks_OrEmoji', rs)
    // }

    return rs
  }

  _isEqual_RawText_Links (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchTextLinksOnly = me._lnkc.isMatch(block)
    const rs = isMatchRawTextOnly && isMatchTextLinksOnly
    return rs
  }

  _isEqual_RawText_Emoji (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchEmojisOnly = me._emjc.isMatch(block)
    const rs = isMatchRawTextOnly && isMatchEmojisOnly
    return rs
  }

  _isEqual_RawText_Emoji_Number (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchEmojisOnly = me._emjc.isMatch(block)
    const isMatchCountNumberOnly = me._numc.isMatch(block)
    const rs = isMatchRawTextOnly && isMatchEmojisOnly && isMatchCountNumberOnly
    return rs
  }

  _isEqual_Text_Num_Emoji_Number (block) {
    const me = this
    const isMatchRawTextOnly = me._txtc.isMatch(block)
    const isMatchEmojisOnly = me._emjc.isMatch(block)
    const isMatchCountNumberOnly = me._numc.isMatch(block)
    const isMatchContentNumberOnly = me._txnc.isMatch(block)
    const rs =
      isMatchRawTextOnly &&
      isMatchEmojisOnly &&
      isMatchCountNumberOnly &&
      isMatchContentNumberOnly
    return rs
  }

  _isEqual_RawText_Links_Emoji (block) {
    const me = this
    const isMatchRawText = me._txtc.isMatch(block)
    const isMatchTextLinks = me._lnkc.isMatch(block)
    const isMatchEmojis = me._emjc.isMatch(block)
    const rs = isMatchRawText && isMatchTextLinks && isMatchEmojis
    return rs
  }

  _isEqual_Links_Emoji (block) {
    const me = this
    const isMatchTextLinks = me._lnkc.isMatch(block)
    const isMatchEmojis = me._emjc.isMatch(block)
    const rs = isMatchTextLinks && isMatchEmojis

    // console.log('🥥 block: ', block.id)
    // console.log('isMatchTextLinks: ', isMatchTextLinks)
    // console.log('isMatchEmojis: ', isMatchEmojis)
    return rs
  }

  _isEqual_RawText_Links_Emoji_Special (block) {
    const me = this
    const isMatchRawText = me._txtc.isMatch(block)
    const isMatchTextLinks = me._lnkc.isMatch(block)
    const isMatchEmojis = me._emjc.isMatch(block)
    const isMatchSpecial = me._spec.isMatch(block)
    const rs =
      isMatchRawText && isMatchTextLinks && isMatchEmojis && isMatchSpecial

    // console.log('🥥 block: ', block.id)
    // console.log('isMatchRawText: ', isMatchRawText)
    // console.log('isMatchTextLinks: ', isMatchTextLinks)
    // console.log('isMatchEmojis: ', isMatchEmojis)
    // console.log('isMatchSpecial: ', isMatchSpecial)
    return rs
  }
}
