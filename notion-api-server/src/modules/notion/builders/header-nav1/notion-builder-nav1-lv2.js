import { Lv2Builder } from '../base/lv2Builder.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'

import { EcoNotionBuilderNav1Lv3 } from './notion-builder-nav1-lv3.js'
import { EcoNotionBlocksConfig as cfg} from '../../configs/notion-blocks-config.js'

export class EcoNotionBuilderNav1Lv2 extends Lv2Builder {
  _lv2Text = ''
  constructor (pageId, lv1BlockId, parents, friends, children) {
    super('EcoNotionBuilderNav1Lv2', lv1BlockId)
    this._pageId = pageId
    this._parents = parents
    this._friends = friends
    this._children = children
  }

  getBlocks () {
    const me = this
    const pageId = me._pageId
    const parents = me._parents
    const friends = me._friends
    const children = me._children
    //Working:
    const nav1Lv2Blocks = me.#buildNavBlocks({
      pageId,
      parents,
      friends,
      children,
    })
    return nav1Lv2Blocks
  }

  #buildNavBlocks ({ pageId, parents, friends, children }) {
    const me = this
    const lbl = cfg.pageTypeLabels
    const rs = []
    if (parents?.length)
      rs.push(me.#createToggleFolder(pageId, lbl.parent, parents))
    if (friends?.length)
      rs.push(me.#createToggleFolder(pageId, lbl.friend, friends))
    if (children?.length)
      rs.push(me.#createToggleFolder(pageId, lbl.children, children))
    return rs
  }

  #createToggleFolder (pageId, label, items) {
    const me = this
    const lv3Builder = EcoNotionBuilderNav1Lv3.instance
    const text = `${label} (${items.length.toString().padStart(2, '0')})`
    return me.#createToggleBlock(text, lv3Builder.getLv3Blocks(pageId, items))
  }

  #createToggleBlock (text, childrenLv3 = []) {
    const block = new EcoNotionBuilderBlockToggle()
      .setText(text)
      .setChildrenBlocks(childrenLv3).oBlockSafe
    return block
  }
}
