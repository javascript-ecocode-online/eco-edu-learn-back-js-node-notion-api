import { EcoBuilderBlockComparer as Base } from '../base/builder-block-comparer.js'
//import { EcoNotionTaskBlockMapText as mt } from '../../tasks/notion-task-block-map-text.js'
//import { EcoTextUtil as uTxt } from '../../../../utils/text.js'

export class EcoNotionNav2Lv1Comparer extends Base {
  
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionNav2Lv1Comparer',
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
//_inputCompareEmojiText