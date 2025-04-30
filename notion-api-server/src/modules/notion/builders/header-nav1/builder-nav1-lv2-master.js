import { EcoNotionBuilderLv2Master as Base } from '../base/builder-lv2-master.js'
import { EcoNotionBuilderNav1Lv2Data } from './builder-nav1-lv2-data.js'
import { EcoNotionBuilderNav1Lv2Comparer } from './builder-nav1-lv2-comparer.js'
import { EcoNotionBuilderNav1Lv3Master as Lv3} from './builder-nav1-lv3-master.js'
export class EcoNotionBuilderNav1Lv2Master extends Base {
  _parents
  _friends
  _children
  constructor (logCfg) {
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
    return new EcoNotionBuilderNav1Lv2Comparer()
  }
  //Override
  async _getInputBlocks (parentBlock, parentIdChildrenMap) {
    const me = this
    const lv1BlockId = parentBlock?.id
    const pageId = me._pageId
    const parents = me._parents
    const friends = me._friends
    const children = me._children
    const builder = new EcoNotionBuilderNav1Lv2Data(pageId, lv1BlockId)
    return await builder.getBlocks(parents, friends, children)
  }

  get _childrenBuilder () {
    return new Lv3()
  }

}
