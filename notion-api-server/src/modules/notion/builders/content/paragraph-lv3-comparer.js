import { EcoBuilderBlockComparer as Base } from '../base/compare/builder-block-comparer.js'

export class EcoNotionParagraphLv3Comparer extends Base {
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionParagraphLv3Comparer',
      level: 'info',
    }
  ) {
    super(logCfg)
  }
  prepare () {
    return this._prepare_Text_num_Emoji_Count()
  }
  isMatchContent (block, reason) {
    const match = this._isMatch_RawText_AndEmoji(block)
    console.log(`✨ isMatchContent EcoNotionParagraphLv3Comparer > ${reason}:`, match)
    //console.log('- isMatchContent nav1-lv3: ', rs)
    return match
  }
  needUpdateRichText (block) {
    return !this._isEqual_Text_Num_Emoji_Number(block)
  }
}
