import { EcoNotionServiceQueryChildren } from '../../services/notion-service-query-children.js'
import { EcoBase } from '../../../../base/eco-base.js'
import { EcoNotionServiceBuildBlockAny } from '../../services/notion-service-build-block-any.js'
import { NotionIdHelper } from '../../helpers/id/notion-id-helper.js'

export class Lv0Builder extends EcoBase {
  get _nqc () {
    return EcoNotionServiceQueryChildren.instance
  }
  get _anyBlockSvc () {
    return EcoNotionServiceBuildBlockAny.instance
  }
  constructor (logConfig = { isDebug: false, name: 'builder', level: 'info' }) {
    super(logConfig)
  }

  _cleanId (pageId) {
    return NotionIdHelper.cleanId(pageId)
  }
}
