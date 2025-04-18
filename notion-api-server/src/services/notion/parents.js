import { notion } from '../../config/notionClient.js'
import { getTitle } from '../../utils/title.js' // nếu bạn dùng helper tách title
export async function getAllParentPages (pageId) {
  const result = []
  let currentId = pageId

  while (currentId) {
    const page = await notion.pages.retrieve({ page_id: currentId })

    if (page.parent?.type === 'page_id') {
      const parentId = page.parent.page_id
      const parent = await notion.pages.retrieve({ page_id: parentId })

      result.push({
        id: parentId,
        title: getTitle(parent),
        type: 'page',
      })

      currentId = parentId
    } else if (page.parent?.type === 'database_id') {
      const databaseId = page.parent.database_id
      const db = await notion.databases.retrieve({ database_id: databaseId })

      result.push({
        id: databaseId,
        title: db.title?.[0]?.plain_text || '(Untitled Database)',
        type: 'database',
      })

      break // database là gốc → dừng lại
    } else {
      break // workspace hoặc unknown → dừng
    }
  }

  return result
}
