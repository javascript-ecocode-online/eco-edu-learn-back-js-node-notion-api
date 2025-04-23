import { NotionIdHelper as hp } from './notion-id-helper.js'
export class NotionUrlHelper {
  static getNotionUrl (pageId) {
    const cleanId = hp.cleanId(pageId)
    return `https://www.notion.so/${cleanId}`
  }
}
//nUrlHelper
