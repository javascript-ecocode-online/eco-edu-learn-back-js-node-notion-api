import { EcoNotionLv2Builder } from '../base/lv2-builder.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'

import { EcoNotionBuilderNav1Lv3Data } from './builder-nav1-lv3-data.js'
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

  async getBlocks (parents, friends, children) {
    const me = this
    const lbl = cfg.pageTypeLabels
    await me.#createBlock(lbl.parent, parents)
    await me.#createBlock(lbl.friend, friends)
    await me.#createBlock(lbl.children, children)
    return me.#blocks
  }

  async #createBlock (label, items) {
    const me = this
    if (!items?.length) return this
    const blocks = me.#blocks
    const pageId = me.#pageId
    const toggle = await me.#createToggle(pageId, label, items)
    //console.log('🌈 toggle: ', toggle)
    blocks.push(toggle)
    return this
  }

  #getLabel (label, items) {
    return `${label} (${items.length.toString().padStart(2, '0')})`
  }

  async #getLv3Blocks (pageId, items) {
    const lv3 = EcoNotionBuilderNav1Lv3Data.instance
    return await lv3.getLv3Blocks(pageId, items)
  }

  async #createToggle (pageId, label, items) {
    const me = this
    const toggle = new EcoNotionBuilderBlockToggle()
    const text = me.#getLabel(label, items)
    const childrenLv3 = await me.#getLv3Blocks(pageId, items)
    return toggle.setText(text).setChildrenBlocks(childrenLv3).oBlockSafe
  }
}
