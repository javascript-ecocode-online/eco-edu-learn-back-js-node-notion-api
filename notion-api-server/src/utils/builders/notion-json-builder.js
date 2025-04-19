export class NotionJsonBuilder {
  static buildRichText (text) {
    return [
      {
        type: 'text',
        text: { content: text },
      },
    ]
  }
}
