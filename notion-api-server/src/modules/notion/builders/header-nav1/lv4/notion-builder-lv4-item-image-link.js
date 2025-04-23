import { NotionBuilderLv4ItemSingleLink as Base } from './notion-builder-lv4-item-single-link.js'
import { EcoNotionServiceQueryPage } from '../../../services/notion-service-query-page.js'

export class NotionBuilderLv4ItemImageLink extends Base {
  constructor (logConfig = 'NotionBuilderLv4ItemSingleLink') {
    super(logConfig)
  }
  async build (){

    const me = this
    const targetPageId = me.targetPageId
    const blockLv3Id = me.blockLv3Id
    const children = me.children

    const nqPage = EcoNotionServiceQueryPage.instance
    const reason = 'NotionBuilderLv4ItemImageLink > addImageLink'
    const imageUrl = await nqPage.getPageCoverImageUrl(reason, targetPageId)
    if (imageUrl) {
      const emj = '🏞️ '
      const imgName = imageUrl.split('/').pop().trim()
      //const content = `🏞️ ${imgName}`
      const hasChild = await me._hasChildWithImageLink(children, emj, imgName)
      if (hasChild) {
        // console.log(
        //   `> Block ${blockLv3Id} đã tồn tại block con ${emj} ${imgName}!`
        // )
      } else {
        await me._appendLinkToggleBlock(blockLv3Id, emj, imgName, imageUrl)
      }
    }
  }
}
