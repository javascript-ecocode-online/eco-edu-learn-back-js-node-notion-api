import { EcoNotionBuilderDataText as Base } from '../base/builder-data-text.js'
import { EcoTextUtil as uTxt } from '../../../../utils/text.js'

// import { NotionJsonArrayHelper } from '../../helpers/object/notion-object-array-helper.js'
// import { EcoNotionTemplateLv1 } from '../../templates/notion-template-lv1.js'
// import { EcoTaskUrl as eUrl } from '../../../eco/tasks/eco-task-url.js'
// import { NotionUrlHelper as nUrl } from '../../helpers/id/notion-url-helper.js'
// import { NotionIdHelper as nId } from '../../helpers/id/notion-id-helper.js'
// Lớp này chịu trách nhiêm tạo dữ liệu cho dòng text nav1 lv1
export class EcoNotionParagraphLv1RawItemsBuilder extends Base {
  _pageId
  _block
  _emoji1
  _emoji2
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionParagraphLv1RawItemsBuilder',
      level: 'info',
    }
  ) {
    super(logCfg)
  }
  setBeginEmoji (emj) {
    this._emoji1 = emj
    this._emoji2 = emj
  }
  setPageId (pageId) {
    const me = this
    me._pageId = pageId
    return me
  }
  setPageInfo (pageInfo) {
    const me = this
    me._pageInfo = pageInfo
    return me
  }
  setBlock (block) {
    const me = this
    me._block = block
    return me
  }
  setEmoji (emoji) {
    const me = this
    //me._emoji1 = me._emoji2
    me._emoji2 = emoji
    //console.log('----- setEmoji -----')
    //console.log(me._emoji1)
    //console.log(me._emoji2)
    return me
  }

  #addFluteToSentences (content) {
    const sentences = content.match(/[^.!?]+[.!?]?/g) || []

    const isOnlyEmoji = text => {
      // Xoá khoảng trắng rồi kiểm tra toàn bộ là emoji
      const noSpace = text.trim().replace(/\s/g, '')
      return noSpace.length > 0 && /^[\p{Emoji}]+$/u.test(noSpace)
    }

    const processed = sentences.map((sentence, index) => {
      const trimmed = sentence.trim()

      // Nếu là câu cuối và chỉ có emoji => giữ nguyên, không thêm 🪈
      if (index === sentences.length - 1 && isOnlyEmoji(trimmed)) {
        return trimmed
      }

      // Nếu đã có 🪈 ở đầu thì giữ nguyên
      if (trimmed.startsWith('🪈')) {
        return trimmed
      }

      return '🪈 ' + trimmed
    })

    return processed.join(' ')
  }

  #isLink (str) {
    return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/.test(str)
  }

  #getRawText (text) {
    return text ? uTxt.getRawText(text) : text
  }

  #getFinalText (content, emj1, emj2, newRt, status) {
    const me = this
    //console.log('🏡 newRt', newRt)
    //console.log('🏡 _pageInfo', me._pageInfo?.properties?.title?.title)
    const c = newRt?.text?.content?.trim()
    if (status.isHome) {
      if (c === '🏡') status.isHome = true
    } else if (me.#isLink(c) && c === newRt?.text?.link?.url?.trim()) {
      const ta = me._pageInfo?.properties?.title?.title
      content = ta?.length
        ? me.#getRawText(ta[0]?.plain_text ?? content)
        : content
    }
    //console.log(emj1)
    //console.log(emj2)
    //content = this.#addFluteToSentences(content)
    //const trimmedEmj2 = emj2.trim()
    let rs = content?.replace(
      new RegExp(emj1, 'g'),
      (match, offset, string) => {
        // Lấy phần sau emj1
        const after = string.slice(offset + match.length)
        // Kiểm tra nếu phần sau chỉ toàn khoảng trắng rồi đến dấu câu hoặc hết chuỗi
        if (/^\s*([.!?]|$)/.test(after)) {
          return emj2
        }
        return match // không thay
      }
    )
    rs = rs ?? ''
    console.log(' 🏠 --- getFinalText ---', rs)
    if (rs.endsWith(' ' + emj2)) {
      // Đúng định dạng rồi, không làm gì cả
    } else if (rs.endsWith(emj2)) {
      // Có emoji nhưng thiếu khoảng trắng trước → sửa lại
      rs = rs.slice(0, -emj2.length) + ' ' + emj2
    } else {
      // Không có emoji → thêm vào
      rs += ' ' + emj2
    }
    //return this.#addFluteToSentences(rs)
    return rs
  }

  #replaceFireWithWing (richTextArray) {
    const me = this
    const emj1 = me._emoji1
    const emj2 = me._emoji2
    const status = {}
    return richTextArray.map(rt => {
      // Sao chép object gốc để giữ nguyên annotations và các thuộc tính khác
      const newRt = { ...rt }

      // Nếu là loại có text.content thì thay trong đó
      if (newRt.type === 'text' && newRt.text?.content) {
        newRt.text = {
          ...newRt.text,
          content: me.#getFinalText(
            newRt.text.content,
            emj1,
            emj2,
            newRt,
            status
          ),
        }
      }

      if (newRt?.text?.link?.url?.trim()) {
        newRt.annotations = {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: true,
          code: false,
          color: 'blue',
        }
      }

      // Đồng thời sửa plain_text nếu cần (plain_text tự sinh, nhưng có thể bạn cần đồng bộ)
      if (newRt.plain_text) {
        newRt.plain_text = me.#getFinalText(
          newRt.plain_text,
          emj1,
          emj2,
          newRt,
          status
        )
      }
      //me._emoji1 =  me._emoji2
      return newRt
    })
  }

  getRichTextData () {
    const me = this
    const block = me._block
    //console.log()
    const richText = me.#replaceFireWithWing(block[block.type].rich_text)
    return richText
  }
}
