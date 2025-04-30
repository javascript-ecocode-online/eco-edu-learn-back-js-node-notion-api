import { EcoBuilderBlockComparer as Base } from '../base/builder-block-comparer.js'

export class EcoNotionNav2Lv2Comparer extends Base {
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionNav2Lv2Comparer',
      level: 'info',
    }
  ) {
    super(logCfg)
  }
  prepare () {
    return this._prepare_Text_num_Emoji_Count()
  }
  isMatchContent (block) {
    return this._isMatch_RawText_OrEmoji(block)
  }
  needUpdateRichText (block) {
    return !this._isEqual_Text_Num_Emoji_Number(block)
  }
}