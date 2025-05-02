import { EcoNotionLv2Builder } from '../base/level/lv2-builder.js'
import { EcoNotionBuilderBlockParagraph } from '../blocks/notion-builder-block-paragraph.js'
import { EcoNotionServiceQueryChildren as QueryService } from '../../services/notion-service-query-children.js'

import { EcoNotionBlocksConfig as cfg } from '../../configs/notion-blocks-config.js'

export class EcoNotionNav3Lv2RawBlocksBuilder extends EcoNotionLv2Builder {
  _lv2Text = ''
  #blocks
  #pageId
  #pageBlocks
  #parentBlock
  constructor (pageId, lv1BlockId, parentBlock, pageBlocks) {
    super('EcoNotionNav3Lv2RawBlocksBuilder', lv1BlockId)
    this.#blocks = []
    this.#pageId = pageId
    this.#parentBlock = parentBlock
    this.#pageBlocks = pageBlocks
  }
  #incrementString (str) {
    const match = str.match(/(.*?)(\d+)?$/) // tách phần chữ và phần số cuối (nếu có)
    const prefix = match[1]
    const number = match[2]

    if (number !== undefined) {
      const newNumber = String(parseInt(number, 10) + 1).padStart(
        number.length,
        '0'
      )
      return prefix + newNumber
    } else {
      return str + '1'
    }
  }
  #getDataVersionText (eTxt) {
    //const me = this
    const lbl = cfg.nav3Lv2Labels.dataVersion
    const str = eTxt && eTxt.includes(lbl) ? eTxt : lbl
    //console.log('🌳 dataVersionExistingText', eTxt)
    //const pageBlocks = me.#pageBlocks?.filter(b => b.type == 'toggle')
    //console.log('🪻 #getDataVersionText', pageBlocks)
    //for (const pageBlock in pageBlocks) {
    //console.log(pageBlock)
    //}
    return this.#incrementString(str)
  }
  #getBuildToolVersion () {
    const lbl = cfg.nav3Lv2Labels

    return lbl.buildToolVersion
  }
  #getBuiltDate () {
    const lbl = cfg.nav3Lv2Labels
    const date = new Date()

    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0') // Tháng tính từ 0
    const yyyy = date.getFullYear()

    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')

    const dateText = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`
    return lbl.builtDate + dateText
  }
  get _nqc () {
    return QueryService.instance
  }
  async #getDataVersionExistingText () {
    const me = this
    const nqc = me._nqc
    const lbl = cfg.nav3Lv2Labels.dataVersion
    const parentId = me._lv1BlockId
    const reason = '#getDataVersionExistingText'
    const blocks = await nqc.getAllChildrenById(reason, parentId, 'paragraph')
    for (const block of blocks) {
      for (const richText of block[block.type].rich_text) {
        if (richText.plain_text.includes(lbl)) {
          return richText.plain_text
        }
      }
    }

    return ''
  }
  async getBlocks () {
    //return null
    const me = this

    const dataVersionExistingText = await me.#getDataVersionExistingText()

    await me.#createBlock(me.#getDataVersionText(dataVersionExistingText))
    await me.#createBlock(me.#getBuildToolVersion())
    await me.#createBlock(me.#getBuiltDate())

    return me.#blocks
  }

  async #createBlock (label) {
    const me = this
    const blocks = me.#blocks
    //const pageId = me.#pageId
    const block = await me.#createParagraphBlock(label)
    //console.log('🌈 toggle: ', toggle)
    blocks.push(block)
    return this
  }

  #getLabel (label) {
    return `${label}`
  }

  // async #getLv3Blocks (pageId, items) {
  //   const lv3 = EcoNotionNav1Lv3RawBlocksBuilder.instance
  //   return await lv3.getLv3Blocks(pageId, items)
  // }

  async #createParagraphBlock (text) {
    //const me = this
    const block = new EcoNotionBuilderBlockParagraph()
    //const childrenLv3 = await me.#getLv3Blocks(pageId)
    return block.setText(text).oBlockSafe
  }
}
