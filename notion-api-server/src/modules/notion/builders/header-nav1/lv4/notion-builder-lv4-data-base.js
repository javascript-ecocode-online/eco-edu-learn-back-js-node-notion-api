import { EcoBase as Base } from '../../../../../base/eco-base.js'
import { NotionIdHelper } from '../../../helpers/id/notion-id-helper.js'
import { EcoNotionBlocksConfig as cfg } from '../../../configs/notion-blocks-config.js'

export class NotionBuilderLv4DataBase extends Base {
  _resultBlock
  _targetPageId
  constructor (logConfig = 'NotionBuilderLv4DataBase') {
    super(logConfig)
  }
  _cleanId (pageId) {
    return NotionIdHelper.cleanId(pageId)
  }
  get _linksDivider () {
    return cfg.linksDivider
  }
  setTargetPageId (targetPageId) {
    this._targetPageId = targetPageId
    return this
  }
  get resultBlock () {
    return this._resultBlock
  }
}
