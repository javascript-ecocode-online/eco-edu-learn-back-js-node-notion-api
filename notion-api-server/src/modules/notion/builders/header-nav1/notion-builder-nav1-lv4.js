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

  async #appendLinkToggleBlock (blockLv3Id, emoji, content, url) {
    try {
      const emojiObj = new EcoNotionBuilderObjectText().setContent(
        emoji
      ).oObjSafe
      const linkObj = new EcoNotionBuilderObjectText()
        .setContent(content)
        .setLink(url).oObjSafe
      const blockLv4 = new EcoNotionBuilderBlockParagraph().setRichTextArray([
        emojiObj,
        linkObj,
      ]).oBlockRaw
      const svc = new EcoNotionServiceBuildBlockToggle()
      const response = blockLv4
        ? await svc.appendChild(blockLv3Id, blockLv4)
        : null

      console.log(
        `✅ Text block ${url} đã được thêm vào toggle block ${blockLv3Id}!`
      )
      return response
    } catch (error) {
      console.error('❌ Lỗi khi thêm text vào toggle block:', error)
    }
  }
  init (lv3Block) {
    this._lv3Block = lv3Block
    return this
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
      console.log(
        `🔥 Block ${blockLv3Id} đã tồn tại block con ${emj} ${displayText}!`
      )
    } else {
      await me.#appendLinkToggleBlock(blockLv3Id, emj, displayText, url)
    }
  }

  async #addBuildLink (blockLv3Id, children, targetPageId) {
    const emj = '✍️ '
    const displayText = targetPageId.replace(/-/g, '')
    const url = `https://build.ecocode.online/?id=${displayText}`
    return await this.#addTextLink(blockLv3Id, children, emj, displayText, url)
  }

  async #addLearnLink (blockLv3Id, children, targetPageId) {
    const emj = '⛵️ '
    const id = targetPageId.replace(/-/g, '')
    const url = `https://learn.ecocode.online/?id=${id}`
    return await this.#addTextLink(blockLv3Id, children, emj, 'Learn', url)
  }

  async #addImageLink (blockLv3Id, children, targetPageId) {
    const me = this
    const nqPage = EcoNotionServiceQueryPage.instance
    const reason = 'EcoNotionBuilderNav1Lv4 > addImageLink'
    const imageUrl = await nqPage.getPageCoverImageUrl(reason, targetPageId)
    if (imageUrl) {
      const emj = '🏞️ '
      const imgName = imageUrl.split('/').pop().trim()
      const content = `🏞️ ${imgName}`
      const hasChild = await me.#hasChildWithImageLink(children, emj, imgName)
      if (hasChild) {
        console.log(
          `🔥 Block ${blockLv3Id} đã tồn tại block con ${emj} ${imgName}!`
        )
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
