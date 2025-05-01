import { EcoBuilderBlockComparer as Base } from '../base/compare/builder-block-comparer.js'
export class EcoNotionNav1Lv4Comparer extends Base {
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionNav1Lv4Comparer',
      level: 'info',
    }
  ) {
    super(logCfg)
  }
  prepare () {
    return this._prepare_Text_Emoji_Links_Special()
  }
  isMatchContent (block , reason) {
    const match = this._isMatch_RawText_OrLinks_OrEmoji(block)
    console.log(`✨ isMatchContent EcoNotionNav1Lv4Comparer > ${reason}:`, match)
    return match
  }
  needUpdateRichText (block) {
    return !this._isEqual_RawText_Links_Emoji_Special(block)
  }
}
