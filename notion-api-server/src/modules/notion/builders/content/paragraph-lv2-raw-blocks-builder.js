import { EcoNotionLv2Builder } from '../base/level/lv2-builder.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'
import { EcoNotionParagraphLv3RawBlocksBuilder } from './paragraph-lv3-raw-blocks-builder.js'
import { EcoNotionBlocksConfig as cfg } from '../../configs/notion-blocks-config.js'

export class EcoNotionParagraphLv2RawBlocksBuilder extends EcoNotionLv2Builder {
  _lv2Text = ''
  _buildCase
  #blocks
  #pageId
  constructor (pageId, rootBlock, buildCase) {
    //_lv1BlockId
    super('EcoNotionParagraphLv2RawBlocksBuilder', rootBlock?.id)
    this.#blocks = []
    this.#pageId = pageId
    this._rootBlock = rootBlock
    this._buildCase = buildCase
  }

  #getRawParagraphText (richText) {
    const me = this
    const buildCase = me._buildCase
    const rs = richText
      ?.map(rt => {
        return rt.text.content.replace(new RegExp(buildCase, 'g'), '')
      })
      .join('')
    return rs
  }

  #getSafeRawText(sentence) {
    const chars = [...sentence];
    let startIndex = 0;
    let endIndex = chars.length - 1;
  
    // Tìm vị trí bắt đầu là chữ cái
    for (let i = 0; i < chars.length; i++) {
      if (/\p{L}/u.test(chars[i])) {
        startIndex = i;
        break;
      }
    }
  
    // Tìm vị trí kết thúc hợp lệ (chữ cái hoặc dấu câu)
    const validEnding = /[\p{L}.!?:;…—–\-\)\]\}'"”’]/u;
    for (let i = chars.length - 1; i >= startIndex; i--) {
      if (validEnding.test(chars[i])) {
        endIndex = i;
        break;
      }
    }
  
    let result = chars.slice(startIndex, endIndex + 1).join('').trim();
  
    // Nếu chưa kết thúc bằng dấu câu, thêm "."
    if (!/[.!?:;…—–\-\)\]\}'"”’]$/.test(result)) {
      result += '.';
    }
  
    return result;
  }

  #getEnText (text) {
    let finalText = this.#getSafeRawText(text)
    return `🪔 ${finalText}`
  }

  async #getVnText (text) {
    let finalText = this.#getSafeRawText(text)
    return `🇻🇳 ${finalText}`
  }

  #splitIntoSentences (text) {
    const cleanedText = text?.replace(/🪈/g, ''); 
    const sentenceEndRegex =
      /(?<!\b(?:v\.v|v\d|Mr|Mrs|Dr|ThS|TS|P\.S))(?<=[.!?…])(?=\s+[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẮẰẴẶẤẦẴẬÉÈẼẸẸÊỂỄỆÝỲỴỶỸ])/gu
    return cleanedText
      .split(sentenceEndRegex)
      .map(sentence => sentence?.trim())
      .filter(sentence => sentence.length > 0)
  }

  async getBlocks () {
    const me = this
    const buildCase = me._buildCase
    const rootBlock = me._rootBlock
    const richText = rootBlock ? rootBlock[rootBlock?.type]?.rich_text : []
    const rawParagraphText = me.#getRawParagraphText(richText)
    const isVNOnly = buildCase === '🇻🇳'
    const isNormal = buildCase === '🪈'
    //console.log('☕️ rawParagraphText', rawParagraphText)
    const rawSentenses = me.#splitIntoSentences(rawParagraphText)
    const isManySentenses = rawSentenses.length > 1
    if (isNormal && isManySentenses) await me.#createDividerBlock()
    if (isNormal) await me.#createBlock('🪺 ', 'p')
    if (isNormal && isManySentenses) await me.#createDividerBlock()
    if (isNormal) {
      for (const s of rawSentenses) {
        //console.log('☕️ raw sentense', s)
        const enText = me.#getEnText(s)
        await me.#createBlock(enText, 'e')
      }
    }

    if (isNormal && isManySentenses) await me.#createDividerBlock()
    if (isNormal || isVNOnly) {
      for (const s of rawSentenses) {
        //console.log('☕️ raw sentense', s)
        const vnText = await me.#getVnText(s)
        await me.#createBlock(vnText, 'v')
      }
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
      divider: {},
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
