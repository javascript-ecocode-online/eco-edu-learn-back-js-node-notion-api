import { EcoNotionBuilderLv2Master as Base } from '../base/level/builder-lv2-master.js'
import { EcoNotionNav3Lv2RawBlocksBuilder } from './nav3-lv2-raw-blocks-builder.js'
import { EcoNotionNav3Lv2Comparer } from './nav3-lv2-comparer.js'
//import { EcoNotionNav1Lv3Builder as Lv3} from './nav1-lv3-builder.js'
export class EcoNotionNav3Lv2Builder extends Base {
  _pageBlocks
  _parentBlock
  constructor (logCfg = {
    isDebug: false,
    name: 'EcoNotionNav3Lv2Builder',
    level: 'info',
  }) {
    super(logCfg)
  }

  setPageBlocks (pageBlocks) {
    const me = this
    me._pageBlocks = pageBlocks
    return me
  }

  setParentBlock (parentBlock) {
    const me = this
    me._parentBlock = parentBlock
    return me
  }
  
  //Override
  _getNewTextComparer () {   
    return new EcoNotionNav3Lv2Comparer()
  }
  //Override
  async _getInputBlocks (parentBlock, parentIdChildrenMap) {
    const me = this
    const lv1BlockId = parentBlock?.id
    const pageId = me._pageId
    const pageBlocks = me._pageBlocks
    //const parentBlock = me.parentBlock
    //console.log('🏡 parentBlock', parentBlock[parentBlock.type].rich_text)
    const builder = new EcoNotionNav3Lv2RawBlocksBuilder(pageId, lv1BlockId, parentBlock, pageBlocks)
    return await builder.getBlocks()
  }

  get _childrenBuilder () {
    //return new Lv3()
    return null
  }

}
