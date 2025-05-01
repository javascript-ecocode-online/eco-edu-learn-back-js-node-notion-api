import { Lv1NavBuilder } from '../base/level/lv1NavBuilder.js'
import { EcoNotionNav2Lv1RawItemsBuilder } from './nav2-lv1-raw-items-builder.js'
import { EcoNotionNav2Lv2Builder } from './nav2-lv2-builder.js'
import { EcoNotionNav2Lv1Comparer as Comparer} from './nav2-lv1-comparer.js'
export class EcoNotionNav2Lv1Builder extends Lv1NavBuilder {
     #textBuilder
      constructor (pageId, info, parents, friends, children, pageBlocks) {
        super('EcoNotionNav2Lv1Builder', pageId)
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
          const friends = me._friends
          const children = me._children
          //const pageInfo = me._info
          const pageBlocks = me._pageBlocks
          me.#textBuilder = new EcoNotionNav2Lv1RawItemsBuilder()
            .setPageId(pageId)
            .setPageBlocks(pageBlocks)
            .setParents(parents)
            .setFriends(friends)
            .setChildren(children)
        }
        return me.#textBuilder
      }
      get _childrenBuilder () {
        const me = this
       
        const pageId = me._pageId
       
        return new EcoNotionNav2Lv2Builder()
          .setPageId(pageId)
        
      }
    
     
}
