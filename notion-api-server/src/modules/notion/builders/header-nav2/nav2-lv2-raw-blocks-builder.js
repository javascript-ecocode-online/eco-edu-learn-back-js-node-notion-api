import { EcoNotionLv2Builder } from '../base/level/lv2-builder.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'

import { EcoNotionBlocksConfig as cfg } from '../../configs/notion-blocks-config.js'

export class EcoNotionNav2Lv2RawBlocksBuilder extends EcoNotionLv2Builder {
  _lv2Text = ''
  #blocks
  #pageId
  constructor (pageId, lv1BlockId) {
    super('EcoNotionNav2Lv2RawBlocksBuilder', lv1BlockId)
    this.#blocks = []
    this.#pageId = pageId
  }

  async getBlocks () {
    //return null
    const me = this
    const lbl = cfg.nav2Lv2Labels
    await me.#createBlock(lbl.listening)
    await me.#createBlock(lbl.speaking)
    await me.#createBlock(lbl.reading)
    await me.#createBlock(lbl.writing)
    await me.#createBlock(lbl.tesing)
    return me.#blocks
  }

  async #createBlock (label) {
    const me = this
    const blocks = me.#blocks
    const pageId = me.#pageId
    const toggle = await me.#createToggle(pageId, label)
    //console.log('🌈 toggle: ', toggle)
    blocks.push(toggle)
    return this
  }

  #getLabel (label) {
    return `${label}`
  }

  async #getLv3Blocks (pageId, items) {
    const lv3 = EcoNotionNav1Lv3RawBlocksBuilder.instance
    return await lv3.getLv3Blocks(pageId, items)
  }

  async #createToggle (pageId, label) {
    const me = this
    const toggle = new EcoNotionBuilderBlockToggle()
    const text = me.#getLabel(label)
    //const childrenLv3 = await me.#getLv3Blocks(pageId)
    return toggle.setText(text).oBlockSafe
  }
}
