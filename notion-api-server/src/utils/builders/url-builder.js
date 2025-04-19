export class UrlBuilder {
  static cleanId (pageId) {
    return pageId.replace(/-/g, '')
  }
  static buildNotionUrl (pageId) {
    const cleanId = this.cleanId(pageId)
    return `https://www.notion.so/${cleanId}`
  }

  static buildEcoBuildUrl (pageId) {
    const cleanId = this.cleanId(pageId)
    return `https://build.ecocode.online?id=${cleanId}`
  }

  static buildEcoLeanUrl (pageId) {
    const cleanId = this.cleanId(pageId)
    return `https://learn.ecocode.online?id=${cleanId}`
  }
}
