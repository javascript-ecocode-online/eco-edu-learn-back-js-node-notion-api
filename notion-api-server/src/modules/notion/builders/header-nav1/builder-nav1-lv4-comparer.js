import { EcoBuilderBlockComparer as Base } from '../base/builder-block-comparer.js'
export class EcoNotionBuilderNav1Lv4Comparer extends Base {
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionBuilderNav1Lv4Comparer',
      level: 'info',
    }
  ) {
    super(logCfg)
  }
  prepare () {
    return this._prepare_Text_Emoji_Links_Special()
  }
  isMatchContent (block) {
    return this._isMatch_RawText_OrLinks_OrEmoji(block)
  }
  needUpdateRichText (block) {
    return !this._isEqual_RawText_Links_Emoji_Special(block)
  }
}
