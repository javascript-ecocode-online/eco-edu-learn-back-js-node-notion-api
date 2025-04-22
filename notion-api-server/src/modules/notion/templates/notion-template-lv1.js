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
      back: { emoji: '🫲', label: '_Back_' },
      end: { emoji: '👇', label: '_End_' },
      chid: { emoji: '👇', label: '_Chid_' },
      next: { emoji: '🫱', label: '_Next_' },
    }
  }
  static get nav3Template () {
    return {
      back: { emoji: '🫲', label: '_Back_' },
      top: { emoji: '👆', label: '_Top_' },
      child: { emoji: '👇', label: '_Child_' },
      next: { emoji: '🫱', label: '_Next_' },
    }
  }
}
