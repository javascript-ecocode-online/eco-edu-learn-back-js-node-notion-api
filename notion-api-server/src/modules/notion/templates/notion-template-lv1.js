export class EcoNotionTemplateLv1 {
  static get nav1Template () {
    return {
      parent: { emoji: '☝', label: '_Parent_' },
      build: { emoji: '✍️', label: '_Build_' },
      learn: { emoji: '👉', label: '_Learn_' },
    }
  }
  static get nav2Template () {
    return {
      back: { emoji: '🫲', label: '_Back_', parent: '🫷' },
      end: { emoji: '👇', label: '_End_' },
      child: { emoji: '🫳', label: '_Chid_', parent: '👇' },
      next: { emoji: '🫱', label: '_Next_', parent: '🫸' },
    }
  }
  static get nav3Template () {
    return {
      back: { emoji: '🫲', label: '_Back_', parent: '🫷' },
      top: { emoji: '👆', label: '_Top_' },
      child: { emoji: '👇', label: '_Child_', parent: '👇' },
      next: { emoji: '🫱', label: '_Next_', parent: '🫸' },
    }
  }
}
