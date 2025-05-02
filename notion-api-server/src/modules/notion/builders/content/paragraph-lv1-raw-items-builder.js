import { EcoNotionBuilderDataText as Base } from '../base/builder-data-text.js'
import { NotionJsonArrayHelper } from '../../helpers/object/notion-object-array-helper.js'
import { EcoNotionTemplateLv1 } from '../../templates/notion-template-lv1.js'
import { EcoTaskUrl as eUrl } from '../../../eco/tasks/eco-task-url.js'
import { NotionUrlHelper as nUrl } from '../../helpers/id/notion-url-helper.js'
import { NotionIdHelper as nId } from '../../helpers/id/notion-id-helper.js'
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
    this._emoji1 = '🔥'
    this._emoji2 = '🔥'
  }
  setPageId (pageId) {
    const me = this
    me._pageId = pageId
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
    console.log('----- setEmoji -----')
    console.log(me._emoji1)
    console.log(me._emoji2)
    return me
  }

  #addFluteToSentences(content) {
    const sentences = content.match(/[^.!?]+[.!?]?/g) || [];
  
    const isOnlyEmoji = (text) => {
      // Xoá khoảng trắng rồi kiểm tra toàn bộ là emoji
      const noSpace = text.trim().replace(/\s/g, '');
      return noSpace.length > 0 && /^[\p{Emoji}]+$/u.test(noSpace);
    };
  
    const processed = sentences.map((sentence, index) => {
      const trimmed = sentence.trim();
      
      // Nếu là câu cuối và chỉ có emoji => giữ nguyên, không thêm 🪈
      if (index === sentences.length - 1 && isOnlyEmoji(trimmed)) {
        return trimmed;
      }
  
      // Nếu đã có 🪈 ở đầu thì giữ nguyên
      if (trimmed.startsWith('🪈')) {
        return trimmed;
      }
  
      return '🪈 ' + trimmed;
    });
  
    return processed.join(' ');
  }

  #getFinalText (content, emj1, emj2) {
    console.log('----- use emj1 emj2 -----')
    console.log(emj1)
    console.log(emj2)
    //content = this.#addFluteToSentences(content)
    const rs = content.replace(new RegExp(emj1, 'g'), emj2)
    console.log(' --- getFinalText ---', rs)
    return this.#addFluteToSentences(rs)
  }

  #replaceFireWithWing (richTextArray) {
    const me = this
    const emj1 = me._emoji1
    const emj2 = me._emoji2
   
    return richTextArray.map(rt => {
      // Sao chép object gốc để giữ nguyên annotations và các thuộc tính khác
      const newRt = { ...rt }

      // Nếu là loại có text.content thì thay trong đó
      if (newRt.type === 'text' && newRt.text?.content) {
        newRt.text = {
          ...newRt.text,
          content: me.#getFinalText(newRt.text.content, emj1, emj2),
        }
      }

      // Đồng thời sửa plain_text nếu cần (plain_text tự sinh, nhưng có thể bạn cần đồng bộ)
      if (newRt.plain_text) {
        newRt.plain_text = me.#getFinalText(newRt.plain_text, emj1, emj2)
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
