import { EcoNotionLv2Builder } from '../base/lv2-builder.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'

import { EcoNotionBuilderNav1Lv3 } from './notion-builder-nav1-lv3.js'
import { EcoNotionBlocksConfig as cfg } from '../../configs/notion-blocks-config.js'

export class EcoNotionBuilderNav1Lv2Data extends EcoNotionLv2Builder {
  _lv2Text = ''
  #blocks
  #pageId
  constructor (pageId, lv1BlockId) {
    super('EcoNotionBuilderNav1Lv2', lv1BlockId)
    this.#blocks = []
    this.#pageId = pageId
  }

  getBlocks (parents, friends, children) {
    const me = this
    const lbl = cfg.pageTypeLabels
    return me.#createBlock(lbl.parent, parents)
      .#createBlock(lbl.friend, friends)
      .#createBlock(lbl.children, children).#blocks
  }

  #createBlock (label, items) {
    const me = this
    if (!items?.length) return this
    const blocks = me.#blocks
    const pageId = me.#pageId
    const toggle = me.#createToggle(pageId, label, items)
    blocks.push(toggle)
    return this
  }

  #getLabel (label, items) {
    return `${label} (${items.length.toString().padStart(2, '0')})`
  }

  #getLv3Blocks (pageId, items) {
    const lv3 = EcoNotionBuilderNav1Lv3.instance
    return lv3.getLv3Blocks(pageId, items)
  }

  #createToggle (pageId, label, items) {
    const me = this
    const toggle = new EcoNotionBuilderBlockToggle()
    const text = me.#getLabel(label, items)
    const childrenLv3 = me.#getLv3Blocks(pageId, items)
    return toggle.setText(text).setChildrenBlocks(childrenLv3).oBlockSafe
  }
}
