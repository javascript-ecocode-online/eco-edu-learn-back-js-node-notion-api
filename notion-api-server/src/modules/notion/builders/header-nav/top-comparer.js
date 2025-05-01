import { EcoBuilderBlockComparer as Base } from '../base/compare/builder-block-comparer.js'
//import { EcoNotionTaskBlockMapText as mt } from '../../tasks/notion-task-block-map-text.js'
//import { EcoTextUtil as uTxt } from '../../../../utils/text.js'

export class EcoNotionTopComparer extends Base {
  
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionTopComparer',
      level: 'info',
    }
  ) {
    super(logCfg)
  }
  prepare () {
    return this._prepare_Text_Emoji_Links_Special()
  }
  isMatchContent (block, reason) {
    
    const match = this._isMatch_RawText_OrLinks_OrEmoji(block)
    console.log(`✨ isMatchContent EcoNotionTopComparer > ${reason}:`, match)
    //if(match) console.log('✨ match ? block.toggle.rich_text: ', block.toggle.rich_text)
    //console.log('✨ match: ', match)
    //this._logDeep('block', block)
    return match
  }
  needUpdateRichText (block) {
    return !this._isEqual_RawText_Links_Emoji_Special(block)
  }
}
//_inputCompareEmojiText