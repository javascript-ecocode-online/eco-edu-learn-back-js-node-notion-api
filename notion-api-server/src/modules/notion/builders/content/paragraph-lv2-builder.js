import { EcoNotionBuilderLv2Master as Base } from '../base/level/builder-lv2-master.js'
import { EcoNotionParagraphLv2RawBlocksBuilder } from './paragraph-lv2-raw-blocks-builder.js'
import { EcoNotionParagraphLv2Comparer } from './paragraph-lv2-comparer.js'
import { EcoNotionParagraphLv3Builder as Lv3 } from './paragraph-lv3-builder.js'
export class EcoNotionParagraphLv2Builder extends Base {
  _rootBlock
  _buildCase
  constructor (logCfg = {
    isDebug: false,
    name: 'EcoNotionParagraphLv2Builder',
    level: 'info',
  }) {
    super(logCfg)
  }
  setRootBlock (block) {
    const me = this
    me._rootBlock = block
    return me
  }
  setBuildCase (buildCase) {
    const me = this
    me._buildCase = buildCase
    return me
  }
 
  //Override
  _getNewTextComparer () {   
    return new EcoNotionParagraphLv2Comparer()
  }
  //Override
  async _getInputBlocks (parentBlock, parentIdChildrenMap) {
    const me = this
    const rootBlock = me._rootBlock
    const pageId = me._pageId
    const buildCase = me._buildCase
    const builder = new EcoNotionParagraphLv2RawBlocksBuilder(pageId, rootBlock, buildCase)
    return await builder.getBlocks()
  }

  get _childrenBuilder () {
    return new Lv3()
  }

}
