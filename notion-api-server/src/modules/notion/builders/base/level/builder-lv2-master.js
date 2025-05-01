//import { Lv0Builder } from './lv0Builder.js'
import { EcoBuilderBlocksMaster as Base } from '../builder-blocks-master.js'
//import { NotionMissionBlocksCompare } from '../../missions/notion-mission-blocks-compare.js'
//import { EcoTextUtil as uTxt } from '../../../../utils/text.js'

export class EcoNotionBuilderLv2Master extends Base {
  _pageId
  constructor (logCfg) {
    super(logCfg)
  }
  setPageId (pageId) {
    const me = this
    me._pageId = pageId
    return me
  }


  
}
