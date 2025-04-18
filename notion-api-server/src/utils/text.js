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
}
