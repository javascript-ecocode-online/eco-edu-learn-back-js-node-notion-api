import { EcoNotionBuilderLv2Master as Base } from '../base/level/builder-lv2-master.js'
import { EcoNotionNav1Lv2RawBlocksBuilder } from './nav1-lv2-raw-blocks-builder.js'
import { EcoNotionNav1Lv2Comparer } from './nav1-lv2-comparer.js'
import { EcoNotionNav1Lv3Builder as Lv3} from './nav1-lv3-builder.js'
export class EcoNotionNav1Lv2Builder extends Base {
  _parents
  _friends
  _children
  constructor (logCfg = {
    isDebug: false,
    name: 'EcoNotionNav1Lv2Builder',
    level: 'info',
  }) {
    super(logCfg)
  }
  setParents (parents) {
    const me = this
    me._parents = parents
    return me
  }
  setFriends (friends) {
    const me = this
    me._friends = friends
    return me
  }
  setChildren (children) {
    const me = this
    me._children = children
    return me
  }
 
  //Override
  _getNewTextComparer () {   
    return new EcoNotionNav1Lv2Comparer()
  }
  //Override
  async _getInputBlocks (parentBlock, parentIdChildrenMap) {
    const me = this
    const lv1BlockId = parentBlock?.id
    const pageId = me._pageId
    const parents = me._parents
    const friends = me._friends
    const children = me._children
    const builder = new EcoNotionNav1Lv2RawBlocksBuilder(pageId, lv1BlockId)
    return await builder.getBlocks(parents, friends, children)
  }

  get _childrenBuilder () {
    return new Lv3()
  }

}
