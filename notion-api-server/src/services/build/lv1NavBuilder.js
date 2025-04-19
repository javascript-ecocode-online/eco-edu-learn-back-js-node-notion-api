import { Lv1Builder } from './lv1Builder.js'
import { NotionJsonBuilder } from '../../utils/builders/notion-json-builder.js'

export class Lv1NavBuilder extends Lv1Builder {
  constructor (name, pageId) {
    super(name, pageId)
  }

  _lv1Text () {
    const items = this._getMenuItemData()
    const result = items.map(item => `${item.emoji} ${item.label}`).join(' | ')
    //console.log('get _lv1Text:', result) // ☝ _Parent_ | ✍️ _Build_ | 👉 _Learn_
    return result
  }

  //Need Override
  _getMenuItemData () {
    throw new Error('Need implement _getMenuItemData')
  }

  //Override
  _getLv1ToggleBlockJson () {
    const me = this
    const items = me._getMenuItemData()
    const richText = me.#buildRichTextWithLinks(items)
    return me.#createToggleBlock(richText)
  }

  #createToggleBlock (richTextOrString) {
    //const me = this
    const jb = NotionJsonBuilder
    const rich_text = Array.isArray(richTextOrString)
      ? richTextOrString
      : jb.buildRichText(richTextOrString)

    return {
      object: 'block',
      type: 'toggle',
      toggle: {
        rich_text,
        //children,
      },
    }
  }

  //Private
  #buildRichTextWithLinks (items) {
    const richText = []

    items.forEach((item, index) => {
      if (index > 0) {
        // Thêm divider nếu không phải phần đầu tiên
        richText.push({
          type: 'text',
          text: { content: ' | ' },
        })
      }

      // Thêm emoji nếu có
      if (item.emoji) {
        richText.push({
          type: 'text',
          text: { content: `${item.emoji} ` },
        })
      }

      // Thêm link text
      richText.push({
        type: 'text',
        text: {
          content: item.label,
          link: { url: item.url },
        },
        //annotations: { italic: true },
      })
    })

    return richText
  }
}
