import { EcoBuilderBlockComparer as Base } from '../base/compare/builder-block-comparer.js'

export class EcoNotionParagraphLv2Comparer extends Base {
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionParagraphLv2Comparer',
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
    if (block.type === 'divider') {
      console.log('divider: ', match)
      console.log(block)
    }
    console.log(
      `✨ isMatchContent EcoNotionParagraphLv2Comparer > ${reason}:`,
      match
    )
    return match
  }
  needUpdateRichText (block) {
    if (block.type === 'divider') return false
    return !this._isEqual_Text_Num_Emoji_Number(block)
  }
}
