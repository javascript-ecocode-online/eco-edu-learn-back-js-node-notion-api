import { EcoBuilderBlockFindUpdate as Base } from '../crud/builder-block-find-update.js'

export class EcoNotionBuilderLv1Master extends Base {
  _pageId

  constructor (logCfg, pageId) {
    super(pageId, logCfg)
    this._pageId = pageId
  }


}
