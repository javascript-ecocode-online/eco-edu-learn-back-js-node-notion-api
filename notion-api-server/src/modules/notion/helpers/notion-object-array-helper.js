export class NotionJsonArrayHelper {
  static getFirstBlockId (array) {
    const id = array?.[0]?.id ?? ''
    return id
  }
}
