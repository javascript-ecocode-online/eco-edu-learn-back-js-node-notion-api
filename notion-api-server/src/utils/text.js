export class EcoTextUtil {
  static normalizeText (text) {
    return text
      ? text
          .replace(/\([^)]*\)/g, '') // bỏ nội dung trong dấu ngoặc ()
          .replace(
            /[\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic}]/gu,
            ''
          ) // bỏ emoji
          .replace(/[^\p{L}\p{N}\s]/gu, '') // bỏ ký tự đặc biệt (chỉ giữ chữ và số và khoảng trắng)
          .replace(/\s+/g, ' ') // chuẩn hóa khoảng trắng
          .trim()
          .toLowerCase()
      : ''
  }
  static getContentNumInText (text) {
    return text
    ? text
        .replace(/\([^)]*\)/g, '') // Bỏ nội dung trong ngoặc ()
        .replace(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
          ''
        ) // Bỏ emoji
        .replace(/[^0-9]/g, '') // Bỏ tất cả trừ số
    : '';
  }
  static getEmojiString (text) {
    // Regex để match emoji
    //const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu
    const emojiRegex = /[\p{Emoji_Presentation}\uFE0F]/gu

    // Tìm tất cả emoji và nối lại thành chuỗi
    const emojis = text.match(emojiRegex)
    return emojis ? emojis.join('') : ''
  }

  static getCountNumberString (text) {
    const match = text.match(/\((\d+)\)/)
    return match ? match[1] : ''
  }
  static getSpecialCharacters (text) {
    // Bước 1: Xóa emoji
    const noEmoji = text.replace(
      /[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu,
      ''
    )
    //console.log(' ✨ noEmoji: ', noEmoji)
    // Bước 2: Xóa số, chữ cái thường, chữ cái hoa, chữ có dấu tiếng Việt và khoảng trắng
    const noLetters = noEmoji.replace(
      /[0-9a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF]/g,
      ''
    )

    return noLetters
  }
}
