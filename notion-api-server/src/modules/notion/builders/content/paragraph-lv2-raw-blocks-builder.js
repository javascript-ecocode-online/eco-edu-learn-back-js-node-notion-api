import { EcoNotionLv2Builder } from '../base/level/lv2-builder.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'
import { EcoNotionParagraphLv3RawBlocksBuilder } from './paragraph-lv3-raw-blocks-builder.js'
import { EcoNotionBlocksConfig as cfg } from '../../configs/notion-blocks-config.js'

export class EcoNotionParagraphLv2RawBlocksBuilder extends EcoNotionLv2Builder {
  _lv2Text = ''
  #blocks
  #pageId
  constructor (pageId, rootBlock) {
    //_lv1BlockId
    super('EcoNotionParagraphLv2RawBlocksBuilder', rootBlock?.id)
    this.#blocks = []
    this.#pageId = pageId
    this._rootBlock = rootBlock
  }

  #getRawParagraphText (richText) {
    const rs = richText
      ?.map(rt => {
        return rt.text.content.replace(/🔥/g, '')
      })
      .join('')
    return rs
  }

  #getEnText (text) {
    return `🪔 ${text}`
  }

  async #getVnText (text) {
    return `🇻🇳 ${text}`
  }

  #splitIntoSentences (text) {
    const sentenceEndRegex =
      /(?<!\b(?:v\.v|v\d|Mr|Mrs|Dr|ThS|TS|P\.S))(?<=[.!?…])(?=\s+[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẮẰẴẶẤẦẴẬÉÈẼẸẸÊỂỄỆÝỲỴỶỸ])/gu
    return text
      .split(sentenceEndRegex)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
  }

  async getBlocks () {
    const me = this
    const rootBlock = me._rootBlock
    const richText = rootBlock ? rootBlock[rootBlock?.type]?.rich_text : []
    const rawParagraphText = me.#getRawParagraphText(richText)
    //console.log('☕️ rawParagraphText', rawParagraphText)
    const rawSentenses = me.#splitIntoSentences(rawParagraphText)
    await me.#createDividerBlock()
    await me.#createBlock('🪺 ', 'p')
    await me.#createDividerBlock()
    for (const s of rawSentenses) {
      //console.log('☕️ raw sentense', s)
      const enText = me.#getEnText(s)
      await me.#createBlock(enText, 'e')
    }
    await me.#createDividerBlock()
    for (const s of rawSentenses) {
      //console.log('☕️ raw sentense', s)
      const vnText = await me.#getVnText(s)
      await me.#createBlock(vnText, 'v')
    }
    //const lbl = cfg.pageTypeLabels

    //await me.#createBlock(lbl.friend, friends)
    //await me.#createBlock(lbl.children, children)
    return me.#blocks
  }

  async #createBlock (text, code) {
    const me = this
    //if (!items?.length) return this
    const blocks = me.#blocks
    const pageId = me.#pageId
    const toggle = await me.#createToggle(text, code)
    //console.log('🌈 toggle: ', toggle)
    blocks.push(toggle)
    return this
  }

  async #createDividerBlock () {
    const me = this
    const blocks = me.#blocks
    //console.log('🌈 toggle: ', toggle)
    blocks.push({
      object: 'block',
      type: 'divider',
      divider: {}
    })
    return this
  }

  #getLabel (label, items) {
    return `${label} (${items.length.toString().padStart(2, '0')})`
  }

  async #getLv3Blocks (text, code) {
    const lv3 = EcoNotionParagraphLv3RawBlocksBuilder.instance
    return await lv3.getLv3Blocks(text, code)
  }

  async #createToggle (text, code) {
    const me = this
    const toggle = new EcoNotionBuilderBlockToggle()
    //const text = me.#getLabel(label, items)
    const childrenLv3 = await me.#getLv3Blocks(text, code)
    return toggle.setText(text).setChildrenBlocks(childrenLv3).oBlockSafe
    //return toggle.setText(text).oBlockSafe
  }
}
