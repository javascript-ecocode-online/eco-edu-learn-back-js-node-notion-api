import { NotionBuilderLv4ItemBase as Base } from './notion-builder-lv4-item-base.js'
import { EcoNotionBuilderBlockParagraph } from '../../blocks/notion-builder-block-paragraph.js'
import { EcoNotionBuilderObjectText } from '../../blocks/notion-builder-object-text.js'
import { EcoObjLinkHelper as eObjLnk } from '../../../../eco/helpers/eco-obj-lnk-helper.js'

export class NotionBuilderLv4ItemLearnLinks extends Base {
  constructor (logConfig = 'NotionBuilderLv4ItemSingleLink') {
    super(logConfig)
  }
  #getCompareText (text) {
    return text?.replace(/\|/g, '').replace(/\//g, '').replace(/\s+/g, '')
  }
  async #hasChildWithLinks (children, arrObjects) {
    const me = this
    const inputCompareText = me.#getCompareText(
      arrObjects
        ?.map(o => {
          const emoji = o.emoji?.trim()
          const content = o.content
          //const url = o.url
          return `${emoji} ${content}`
        })
        .join('')
    )

    for (const block of children) {
      if (
        block.type === 'paragraph' && // hoặc kiểm tra type khác nếu cần
        block.paragraph &&
        block.paragraph.rich_text &&
        block.paragraph.rich_text.length > 0
      ) {
        const blockTextArr = me.#getCompareText(
          block.paragraph.rich_text.map(rt => rt.plain_text).join('')
        )
        const isEqual = blockTextArr === inputCompareText
        //console.log(`---> 🍒: Comparing..."`)
        //me._logLines(blockTextArr, inputCompareText)

        //const cleaned = fullText.replace(new RegExp(emj, 'g'), '').trim()
        //console.log(`---> 🍒: "${cleaned}" vs "${linkText}"`)
        if (isEqual) {
          //console.log(isEqual)
          return true // Đã tồn tại block có nội dung trùng
        }
      }
    }
    return false
  }
  #getLinksLv4ToggleBlock (arrObjects) {
    const me = this
    //let idx = 0
    const richText = []
    arrObjects?.forEach((o, index) => {
      if (index > 0) {
        // Thêm divider nếu không phải phần đầu tiên
        const t1 = new EcoNotionBuilderObjectText().setContent(' | ').oObjSafe
        richText.push(t1)
      }

      const emoji = o.emoji?.trim()
      const content = o.content
      const url = o.url

      if (emoji) {
        const t2 = new EcoNotionBuilderObjectText().setContent(
          `${emoji} `
        ).oObjSafe
        richText.push(t2)
      }

      const t3 = new EcoNotionBuilderObjectText()
        .setContent(content)
        .setLink(url).oObjSafe

      richText.push(t3)
    })

    const blockLv4 = richText.length
      ? new EcoNotionBuilderBlockParagraph().setRichTextArray(richText)
          .oBlockRaw
      : null
    return blockLv4
  }
  async #appendLinksToggleBlock (blockLv3Id, arrObjects) {
    const me = this
    try {
      const blockLv4 = me.#getLinksLv4ToggleBlock(arrObjects)
      return blockLv4 ? await me._appendToggleBlock(blockLv3Id, blockLv4) : null
    } catch (error) {
      console.error('❌ Lỗi khi thêm text vào toggle block:', error)
    }
  }
  async #addTextLinks (blockLv3Id, children, arrObjects) {
    const me = this
    const hasChild = await me.#hasChildWithLinks(children, arrObjects)
    if (hasChild) {
      // console.log(
      //   `> Block ${blockLv3Id} đã tồn tại block con ${emj} ${displayText}!`
      // )
    } else {
      await me.#appendLinksToggleBlock(blockLv3Id, arrObjects)
    }
  }
  async build () {
    const me = this
    const targetPageId = me.targetPageId
    const blockLv3Id = me.blockLv3Id
    const children = me.children

    const id = me._cleanId(targetPageId)
    return await me.#addTextLinks(blockLv3Id, children, [
      eObjLnk.getRelatedLearnLinkObject(id),
      eObjLnk.getRelatedTestLinkObject(id),
    ])
  }
}
