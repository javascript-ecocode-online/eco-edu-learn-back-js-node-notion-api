import { Lv1Builder } from './lv1Builder.js'
import { EcoNotionBuilderObjectText } from '../blocks/notion-builder-object-text.js'
import { EcoNotionServiceBuildBlockToggle } from '../../services/notion-service-build-block-toggle.js'

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
  async _updateBlockText (block) {
    const me = this
    const svc = new EcoNotionServiceBuildBlockToggle()
    const richTextArr = me._getLv1ToggleBlockRichTextArr()
    const response = await svc.updateRichText(block.id, richTextArr)
    return response
  }

  //Override
  _getLv1ToggleBlockRichTextArr () {
    const me = this
    const items = me._getMenuItemData()
    return me._buildLv1RichTextArr(items)
  }

  //Private
  _buildLv1RichTextArr (items) {
    const richText = []
    items.forEach((item, index) => {
      if (index > 0) {
        // Thêm divider nếu không phải phần đầu tiên
        const t1 = new EcoNotionBuilderObjectText().setContent(' | ').oObjSafe
        richText.push(t1)
      }

      // Thêm emoji nếu có
      if (item.emoji) {
        const t2 = new EcoNotionBuilderObjectText().setContent(
          `${item.emoji} `
        ).oObjSafe
        richText.push(t2)
      }

      // Thêm link text
      const t3 = new EcoNotionBuilderObjectText()
        .setContent(item.label)
        .setLink(item.url).oObjSafe

      richText.push(t3)
    })

    return richText
  }
}
