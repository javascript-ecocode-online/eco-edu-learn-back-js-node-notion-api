export class NotionJsonArrayHelper {
  /* getFirstBlockId
    [
        {
            id: '1d5118f9-f92a-81a9-8b9d-d19c0a0539bd',
            title: '📘 JavaScript Fundamentals',
            type: 'page'
        },
        {
            id: '1d5118f9-f92a-8140-a537-e24cee803ddd',
            title: 'Data types',
            type: 'page'
        }
    ]
    */
  static getFirstBlockId (array) {
    const id = array?.[0]?.id ?? ''
    return id
  }
}
