import { Lv1NavBuilder } from '../base/lv1NavBuilder.js'
import { EcoNotionNav1Lv1RawItemsBuilder } from './nav1-lv1-raw-items-builder.js'
import { EcoNotionNav1Lv2Builder } from './nav1-lv2-builder.js'
import { EcoNotionNav1Lv1Comparer as Comparer} from './nav1-lv1-comparer.js'
export class EcoNotionNav1Lv1Builder extends Lv1NavBuilder {
  #textBuilder
  constructor (pageId, info, parents, friends, children, pageBlocks) {
    super('EcoNotionNav1Lv1Builder', pageId)
    this._info = info
    this._parents = parents
    this._friends = friends
    this._children = children
    this._pageBlocks = pageBlocks
  }
  // Override from EcoBuilderBlockQuery
  get _blockType () {
    return 'toggle'
  }
  get _textComparer () {
    return new Comparer()
  }
  // Override from EcoBuilderBlockQuery
  get _textBuilder () {
    const me = this
    if (!me.#textBuilder) {
      const pageId = me._pageId
      const parents = me._parents
      me.#textBuilder = new EcoNotionNav1Lv1RawItemsBuilder()
        .setPageId(pageId)
        .setParents(parents)
    }
    return me.#textBuilder
  }
  get _childrenBuilder () {
    const me = this
    const pageId = me._pageId
    const parents = me._parents
    const friends = me._friends
    const children = me._children
    return new EcoNotionNav1Lv2Builder()
      .setPageId(pageId)
      .setParents(parents)
      .setFriends(friends)
      .setChildren(children)
      
  }

 

}
