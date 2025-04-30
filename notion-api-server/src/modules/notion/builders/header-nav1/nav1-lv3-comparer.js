import { EcoBuilderBlockComparer as Base } from '../base/builder-block-comparer.js'

export class EcoNotionNav1Lv3Comparer extends Base {
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionNav1Lv3Comparer',
      level: 'info',
    }
  ) {
    super(logCfg)
  }
  prepare () {
    return this._prepare_Text_Emoji_Links_Special()
  }
  isMatchContent (block) {
    return this._isMatch_Links(block)
  }
  needUpdateRichText (block) {
    return !this._isEqual_Links_Emoji(block)
  }
}
