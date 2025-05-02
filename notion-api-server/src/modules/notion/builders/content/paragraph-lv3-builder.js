import { EcoBuilderBlocksMaster as Base } from '../base/builder-blocks-master.js'
import { EcoNotionParagraphLv3Comparer as Comparer } from './paragraph-lv3-comparer.js'
import { EcoNotionParagraphLv4Builder as Lv4} from './paragraph-lv4-builder.js'

export class EcoNotionParagraphLv3Builder extends Base {
  constructor (logCfg  = {
    isDebug: false,
    name: 'EcoNotionParagraphLv3Builder',
    level: 'info',
  }) {
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
      return null
      //return new Lv4()
    }
}
