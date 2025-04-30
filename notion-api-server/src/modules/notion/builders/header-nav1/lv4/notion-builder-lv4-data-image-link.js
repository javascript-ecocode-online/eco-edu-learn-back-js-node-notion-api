import { NotionBuilderLv4DataSingleLink as Base } from './notion-builder-lv4-data-single-link.js'
import { EcoNotionServiceQueryPage } from '../../../services/notion-service-query-page.js'

export class NotionBuilderLv4DataImageLink extends Base {
  constructor (logConfig = 'NotionBuilderLv4DataImageLink') {
    super(logConfig)
  }

  async #getImageUrl (targetPageId) {
    const nqPage = EcoNotionServiceQueryPage.instance
    const reason = 'NotionBuilderLv4ItemImageLink > addImageLink'
    const imageUrl = await nqPage.getPageCoverImageUrl(reason, targetPageId)
    return imageUrl
  }

  #getImageName (imageUrl) {
    const imgName = imageUrl?.split('/').pop().trim()
    return imgName
  }
  async build () {
    const me = this
    const targetPageId = me._targetPageId
    const id = me._cleanId(targetPageId)

    const url = await me.#getImageUrl(id)
    if (!url) return me
    const displayText = me.#getImageName(url)
    const emj = '🏞️ '
    this._resultBlock = me._getLinkBlock(emj, displayText, url)
    return me
  }
}
