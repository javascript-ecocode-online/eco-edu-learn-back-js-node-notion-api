import { EcoNotionBuilderLv2Master as Base } from '../base/builder-lv2-master.js'
import { EcoNotionNav2Lv2RawBlocksBuilder } from './nav2-lv2-raw-blocks-builder.js'
import { EcoNotionNav2Lv2Comparer } from './nav2-lv2-comparer.js'
//import { EcoNotionNav1Lv3Builder as Lv3} from './nav1-lv3-builder.js'
export class EcoNotionNav2Lv2Builder extends Base {
 
  constructor (logCfg = {
    isDebug: false,
    name: 'EcoNotionNav2Lv2Builder',
    level: 'info',
  }) {
    super(logCfg)
  }
  
  //Override
  _getNewTextComparer () {   
    return new EcoNotionNav2Lv2Comparer()
  }
  //Override
  async _getInputBlocks (parentBlock, parentIdChildrenMap) {
    const me = this
    const lv1BlockId = parentBlock?.id
    const pageId = me._pageId
    
    const builder = new EcoNotionNav2Lv2RawBlocksBuilder(pageId, lv1BlockId)
    return await builder.getBlocks()
  }

  get _childrenBuilder () {
    //return new Lv3()
    return null
  }

}
