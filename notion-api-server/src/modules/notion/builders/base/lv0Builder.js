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
  //  logDeepFull(obj, indent = 0) {
  //   const padding = '  '.repeat(indent);
  
  //   if (Array.isArray(obj)) {
  //     console.log(`${padding}[`);
  //     for (const item of obj) {
  //       logDeepFull(item, indent + 1);
  //     }
  //     console.log(`${padding}]`);
  //   } else if (obj && typeof obj === 'object') {
  //     console.log(`${padding}{`);
  //     for (const [key, value] of Object.entries(obj)) {
  //       if (typeof value === 'object' && value !== null) {
  //         console.log(`${padding}  ${key}:`);
  //         logDeepFull(value, indent + 2);
  //       } else {
  //         console.log(`${padding}  ${key}: ${value}`);
  //       }
  //     }
  //     console.log(`${padding}}`);
  //   } else {
  //     console.log(`${padding}${obj}`);
  //   }
  // }

  
}
