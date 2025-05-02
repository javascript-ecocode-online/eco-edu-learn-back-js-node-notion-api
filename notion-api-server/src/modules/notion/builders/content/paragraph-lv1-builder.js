import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoNotionParagraphLv1RawItemsBuilder } from './paragraph-lv1-raw-items-builder.js'
import { EcoNotionParagraphLv2Builder } from './paragraph-lv2-builder.js'
import { EcoNotionServiceBuildBlockAny as bb } from '../../services/notion-service-build-block-any.js'

export class EcoNotionParagraphLv1Builder extends Base {
  #textBuilder
  _buildCase
  constructor (pageId, block, buildCase) {
    super('EcoNotionNav1Lv1Builder', pageId)
    this._block = block
    this._pageId = pageId
    this._buildCase = buildCase
  }
  
  // Override from EcoBuilderBlockQuery
  get _textBuilder () {
    const me = this
    if (!me.#textBuilder) {
      const pageId = me._pageId
      const block = me._block
      me.#textBuilder = new EcoNotionParagraphLv1RawItemsBuilder()
        .setPageId(pageId)
        .setBlock(block)
    }
    return me.#textBuilder
  }
  get _childrenBuilder () {
    
    const me = this
    const block = me._block
    const pageId = me._pageId
    const buildCase = me._buildCase
    return new EcoNotionParagraphLv2Builder()
      .setPageId(pageId)
      .setRootBlock(block)
      .setBuildCase(buildCase)
  }

   async #updateBlockText (textBuilder, block, emi) {
      const me = this
      //const textBuilder = me._textBuilder
      const type = block.type
      const svc = bb.instance
      const richTextArr = textBuilder.setEmoji(emi).getRichTextData()
      
      return await svc.updateRichText(type, block.id, richTextArr)
    }

  async execute (lv = 1) {
    const me = this
    let rs = {}
    let block = me._block
    if (!block) return rs
    const textBuilder = me._textBuilder
    const buildCase = me._buildCase
    textBuilder.setBeginEmoji(buildCase)
    block = await me.#updateBlockText(textBuilder, block, '♨️')
    
    const childrenBuilder = me._childrenBuilder
    if (childrenBuilder) {
      await childrenBuilder.execute(lv + 1, block, rs)
    }

    block = await me.#updateBlockText(textBuilder, block, '🪞')
    rs[`level-${lv}-rs`] = block
    return rs
  }

}
