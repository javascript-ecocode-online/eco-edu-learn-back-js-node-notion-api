import { Lv1Builder } from './lv1Builder.js'
import { EcoNotionServiceBuildBlockToggle } from '../../services/notion-service-build-block-toggle.js'
import { EcoNotionBuilderRichTextLinks } from '../blocks/notion-builder-rich-text-links.js'
import { EcoNotionBlocksConfig as cfg} from '../../configs/notion-blocks-config.js'
export class Lv1NavBuilder extends Lv1Builder {
  get _linksDivider () {
    return cfg.linksDivider
  }
  constructor (name, pageId, buildCfg) {
    super(name, pageId, buildCfg)
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
    const responseBlock = await svc.updateRichText(block.id, richTextArr)
    return responseBlock
  }

  //Override
  _getLv1ToggleBlockRichTextArr () {
    const me = this
    const helper = new EcoNotionBuilderRichTextLinks()
    const items = me._getMenuItemData()
    const richText = helper.getLinksRichText(items, me._linksDivider)
    return richText
  }
}
