import { EcoUrlHelper as eUrl } from '../../../../eco/helpers/eco-txt-url-helper.js'
import { NotionBuilderLv4ItemSingleLink as Base } from './notion-builder-lv4-item-single-link.js'
export class NotionBuilderLv4ItemBuildLink extends Base {
  constructor (logConfig = 'NotionBuilderLearnLinks') {
    super(logConfig)
  }
  async #addEcoBuildLink ( emj, displayText, url) {
    const me = this
    const blockLv3Id = me.blockLv3Id
    const children = me.children
    const hasChild = await me._hasChildWithImageLink(children, emj, displayText)
    if (hasChild) {
      // console.log(
      //   `> Block ${blockLv3Id} đã tồn tại block con ${emj} ${displayText}!`
      // )
    } else {
      await me._appendLinkToggleBlock(blockLv3Id, emj, displayText, url)
    }
  }

  async build () {
    const me = this
    const emj = '💦 '
    const targetPageId = me.targetPageId
    const cleanPageId = me._cleanId(targetPageId)
    const displayText = cleanPageId
    const url = eUrl.getEcoBuildUrl(cleanPageId)
    return await me.#addEcoBuildLink(emj, displayText, url)
  }
}
