import { EcoBuilderBlockComparer as Base } from '../base/compare/builder-block-comparer.js'

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
    return this._prepare_Text_Emoji_Mention_Special()
  }
  isMatchContent (block, reason) {
    const match = this._isMatch_MentionIds(block)
    console.log(`✨ isMatchContent EcoNotionNav1Lv3Comparer > ${reason}:`, match)
    //console.log('- isMatchContent nav1-lv3: ', rs)
    return match
  }
  needUpdateRichText (block) {
    return !this._isEqual_MentionIds_Emoji(block)
  }
}
