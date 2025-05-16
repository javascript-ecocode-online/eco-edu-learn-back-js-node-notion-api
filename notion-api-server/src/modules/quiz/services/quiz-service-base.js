import { EcoBase } from '../../../base/eco-base.js'
export class QuizBaseService extends EcoBase {
  constructor (logConfig) {
    super(logConfig)
  }
  _normalizeToUUID (id) {
    // Nếu đã có dấu gạch đúng format UUID v4 → trả nguyên
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    ) {
      return id.toLowerCase() // đảm bảo viết thường
    }

    // Nếu là dạng Notion ID không gạch, chèn lại
    if (/^[0-9a-f]{32}$/i.test(id)) {
      return [
        id.slice(0, 8),
        id.slice(8, 12),
        id.slice(12, 16),
        id.slice(16, 20),
        id.slice(20),
      ]
        .join('-')
        .toLowerCase()
    }

    throw new Error('Invalid Notion ID format')
  }

  _buildInsertOrUpdateSQL (tableName, dataObject, keyColumns = []) {
    const columns = Object.keys(dataObject)
    const placeholders = columns.map(() => '?').join(', ')
    const updateFields = columns
      .filter(col => !keyColumns.includes(col)) // bỏ qua cột khóa (thường là id)
      .map(col => `${col} = VALUES(${col})`)
      .join(', ')

    const sql = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders})
    ON DUPLICATE KEY UPDATE ${updateFields}
  `

    const values = columns.map(col =>
      dataObject[col] === undefined ? null : dataObject[col]
    )
    console.log('sql: ', sql)
    console.log('values: ', values)
    return { sql, values }
  }
}
