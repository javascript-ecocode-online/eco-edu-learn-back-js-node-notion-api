import { NotionIdHelper as hp } from './notion-id-helper.js'
export class NotionUrlHelper {
  static getNotionUrl (pageId) {
    const cleanId = hp.cleanId(pageId)
    return `https://www.notion.so/${cleanId}`
  }
  static getNotionBlockUrl (pageId, blockId) {
    const cleanPageId = hp.cleanId(pageId)
    const cleanBlockId = hp.cleanId(blockId)
    return `https://www.notion.so/${cleanPageId}#${cleanBlockId}`
  }
}
//nUrlHelper
