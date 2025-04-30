export class NotionIdHelper {
  static cleanId (pageId) {
    return pageId?.replace(/-/g, '')
  }
  
}
