import { EcoBuilderBlocksMaster as Base } from '../base/builder-blocks-master.js'
import { EcoNotionBuilderNav1Lv3Comparer as Comparer } from './builder-nav1-lv3-comparer.js'
import { EcoNotionBuilderNav1Lv4Master as Lv4} from './builder-nav1-lv4-master.js'

export class EcoNotionBuilderNav1Lv3Master extends Base {
  constructor (logCfg) {
    super(logCfg)
  }
   //Override
    _getNewTextComparer () {   
      return new Comparer()
    }
  //Override
    async _getInputBlocks (parentBlock, parentIdChildrenMap) {
      const me = this
      const parentBlockId = parentBlock?.id
      //console.log('🍊 parentBlock: ', parentBlock)
      //console.log('🥑 parentBlock.toggle.rich_text: ', parentBlock.toggle.rich_text)
      //console.log(`💦 parentIdChildrenMap: ${lv2BlockId}`)
      const childrenBlocks = parentIdChildrenMap ? parentIdChildrenMap[parentBlockId]: []
      //console.log(`⛵️ childrenBlocks: `, childrenBlocks)
      // Object.entries(parentIdChildrenMap).forEach(([key, arr]) => {
      //   console.log(`${key}: `);
      //   arr?.forEach((iBlock, idx) => {
      //       console.log('✨ iBlock > rich_text: ', iBlock[iBlock.type].rich_text);
      //   })
      // });

    //   const pageId = me._pageId
    //   const parents = me._parents
    //   const friends = me._friends
    //   const children = me._children
    //   const builder = new EcoNotionBuilderNav1Lv2Data(pageId, lv1BlockId)
      return childrenBlocks
    }

    get _childrenBuilder () {
      return new Lv4()
    }
}
