import { EcoNotionServiceQueryChildren } from '../../services/notion-service-query-children.js'
import { EcoBase } from '../../../../base/base.js'
import { EcoNotionServiceBuildBlockAny } from '../../services/notion-service-build-block-any.js'
import { UrlBuilder } from '../../../../utils/builders/url-builder.js'

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
    return UrlBuilder.cleanId(pageId)
  }
}
