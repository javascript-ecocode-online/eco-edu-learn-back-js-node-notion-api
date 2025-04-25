export class EcoNotionTaskBlockMapCore {
  static getRichTextFromBlock (block) {
    return block?.[block.type]?.rich_text
  }
}
