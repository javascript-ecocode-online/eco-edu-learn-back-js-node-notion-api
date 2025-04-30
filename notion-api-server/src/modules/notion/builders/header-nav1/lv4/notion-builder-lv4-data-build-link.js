import { NotionBuilderLv4DataSingleLink as Base } from './notion-builder-lv4-data-single-link.js'
import { EcoTaskUrl as eUrl } from '../../../../eco/tasks/eco-task-url.js'

export class NotionBuilderLv4DataBuildLink extends Base {
  constructor (logConfig = 'NotionBuilderLv4DataBuildLinks') {
    super(logConfig)
  }
  
  build () {
    const me = this
    const targetPageId = me._targetPageId
    const id = me._cleanId(targetPageId)
    const emj = '💦 '
    const displayText = id
     const url = eUrl.getEcoBuildUrl(id)
    this._resultBlock = me._getLinkBlock(emj, displayText, url)
    return me
  }
}
