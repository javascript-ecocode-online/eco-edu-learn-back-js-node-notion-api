import { Lv0Builder } from '../base/lv0Builder.js'
import { EcoNotionBuilderBlockParagraph } from '../blocks/notion-builder-block-paragraph.js'
import { EcoNotionBuilderObjectText } from '../blocks/notion-builder-object-text.js'
import { EcoNotionServiceBuildBlockToggle } from '../../services/notion-service-build-block-toggle.js'
import { EcoNotionServiceQueryPage } from '../../services/notion-service-query-page.js'

export class EcoNotionBuilderNav1Lv4 extends Lv0Builder {
  constructor (isResetChildren) {
    super('EcoNotionBuilderNav1Lv4')
    this._isResetChildren = isResetChildren
  }
  #getToggleMentionPageId (block) {
    const rs = block?.toggle?.rich_text
      .filter(
        textItem =>
          textItem.type === 'mention' && textItem.mention.type === 'page'
      )
      .map(textItem => {
        //console.log('>: ', textItem)
        return textItem.mention.page.id
      })
      .join('')

    return rs
  }

  async #appendToggleBlock (blockLv3Id, blockLv4) {
    const me = this
    const svc = new EcoNotionServiceBuildBlockToggle()
    const response = blockLv4
      ? await svc.appendChild(blockLv3Id, blockLv4)
      : null
    let logLbl = `✅ Text block ${response.id} đã được thêm vào toggle block ${blockLv3Id}!`
    me._logLines(logLbl, response)
    logLbl = '> rich_text: '
    me._logLines(logLbl, response[response.type]?.rich_text)
    return response
  }

  #getLinkLv4ToggleRichRTextItem (emoji, content, url) {
    const emojiObj = new EcoNotionBuilderObjectText().setContent(emoji).oObjSafe
    const linkObj = new EcoNotionBuilderObjectText()
      .setContent(content)
      .setLink(url).oObjSafe
    return [emojiObj, linkObj]
  }
  #getLinkLv4ToggleBlock (emoji, content, url) {
    const me = this
    const arr = me.#getLinkLv4ToggleRichRTextItem(emoji, content, url)
    const blockLv4 = new EcoNotionBuilderBlockParagraph().setRichTextArray(
      arr
    ).oBlockRaw
    return blockLv4
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
      return blockLv4 ? await me.#appendToggleBlock(blockLv3Id, blockLv4) : null
    } catch (error) {
      console.error('❌ Lỗi khi thêm text vào toggle block:', error)
    }
  }

  async #appendLinkToggleBlock (blockLv3Id, emoji, content, url) {
    const me = this
    try {
      const blockLv4 = me.#getLinkLv4ToggleBlock(emoji, content, url)
      return blockLv4 ? await me.#appendToggleBlock(blockLv3Id, blockLv4) : null
    } catch (error) {
      console.error('❌ Lỗi khi thêm text vào toggle block:', error)
    }
  }
  init (lv3Block) {
    this._lv3Block = lv3Block
    return this
  }

  #getCompareText (text) {
    return text
      ?.replace(/\|/g, '')
      .replace(/\//g, '')
      .replace(/\s+/g, '')
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
  async #hasChildWithImageLink (children, emj, linkText) {
    if (this._isResetChildren) return false

    if (!children) return false // Không có block con nào trùng text
    // Duyệt qua từng block con và so sánh text
    for (const block of children) {
      if (
        block.type === 'paragraph' && // hoặc kiểm tra type khác nếu cần
        block.paragraph &&
        block.paragraph.rich_text &&
        block.paragraph.rich_text.length > 0
      ) {
        const fullText = block.paragraph.rich_text
          .map(rt => rt.plain_text)
          .join('')

        const cleaned = fullText.replace(new RegExp(emj, 'g'), '').trim()
        //console.log(`---> 🍒: "${cleaned}" vs "${linkText}"`)
        if (cleaned === linkText) {
          return true // Đã tồn tại block có nội dung trùng
        }
      }
    }

    return false // Không có block con nào trùng text
  }

  async #addTextLink (blockLv3Id, children, emj, displayText, url) {
    const me = this
    const hasChild = await me.#hasChildWithImageLink(children, emj, displayText)
    if (hasChild) {
      // console.log(
      //   `> Block ${blockLv3Id} đã tồn tại block con ${emj} ${displayText}!`
      // )
    } else {
      await me.#appendLinkToggleBlock(blockLv3Id, emj, displayText, url)
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
  async #addBuildLink (blockLv3Id, children, targetPageId) {
    const me = this
    const emj = '💦 '
    const displayText = me._cleanId(targetPageId)
    const url = `https://build.ecocode.online/?id=${displayText}`
    return await me.#addTextLink(blockLv3Id, children, emj, displayText, url)
  }

  async #addLearnLink (blockLv3Id, children, targetPageId) {
    const me = this
    const id = me._cleanId(targetPageId)
    return await me.#addTextLinks(blockLv3Id, children, [
      {
        emoji: '⛵️ ',
        content: '_Learn_',
        url: `https://learn.ecocode.online/?id=${id}`,
      },
      {
        emoji: '🌳 ',
        content: '_Test_',
        url: `https://test.ecocode.online/?id=${id}`,
      },
    ])
  }

  async #addImageLink (blockLv3Id, children, targetPageId) {
    const me = this
    const nqPage = EcoNotionServiceQueryPage.instance
    const reason = 'EcoNotionBuilderNav1Lv4 > addImageLink'
    const imageUrl = await nqPage.getPageCoverImageUrl(reason, targetPageId)
    if (imageUrl) {
      const emj = '🏞️ '
      const imgName = imageUrl.split('/').pop().trim()
      //const content = `🏞️ ${imgName}`
      const hasChild = await me.#hasChildWithImageLink(children, emj, imgName)
      if (hasChild) {
        // console.log(
        //   `> Block ${blockLv3Id} đã tồn tại block con ${emj} ${imgName}!`
        // )
      } else {
        await me.#appendLinkToggleBlock(blockLv3Id, emj, imgName, imageUrl)
      }
    }
  }
  async #getLv3ChildrenBlocks (toggleBlockId) {
    const nqc = this._nqc
    // Lấy danh sách block con của toggle block
    const reason = `${this._name} #getLv3ChildrenBlocks`
    const children = await nqc.getAllChildrenById(reason, toggleBlockId)
    return children
  }
  async execute () {
    const me = this
    const blockLv3 = me._lv3Block
    const blockLv3Id = blockLv3.id
    const targetPageId = me.#getToggleMentionPageId(blockLv3)
    const children = await me.#getLv3ChildrenBlocks(blockLv3Id)
    await me.#addLearnLink(blockLv3Id, children, targetPageId)
    await me.#addBuildLink(blockLv3Id, children, targetPageId)
    await me.#addImageLink(blockLv3Id, children, targetPageId)
  }
}
