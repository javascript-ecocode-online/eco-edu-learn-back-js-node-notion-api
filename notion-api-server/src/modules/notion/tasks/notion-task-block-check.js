import { EcoBase as Base } from '../../../base/eco-base.js'
export class EcoNotionTaskBlockCheck extends Base {
  static hasParagraphContent (block) {
    return (
      block.type === 'paragraph' && // hoặc kiểm tra type khác nếu cần
      block.paragraph &&
      block.paragraph.rich_text &&
      block.paragraph.rich_text.length > 0
    )
  }
}
