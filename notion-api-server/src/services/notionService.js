import { Client } from '@notionhq/client'
import dotenv from 'dotenv'

dotenv.config()

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export async function getChildrenPages (pageId) {
  const response = await notion.blocks.children.list({
    block_id: pageId,
  })
  return response.results
}

export async function getPageContent (pageId) {
  const page = await notion.pages.retrieve({ page_id: pageId })
  return page
}

// 🔥 Hàm mới: lấy toàn bộ parent pages
export async function getAllParentPages (pageId) {
  const parents = []

  let currentPageId = pageId

  while (currentPageId) {
    const page = await notion.pages.retrieve({ page_id: currentPageId })

    // Đẩy page hiện tại vào danh sách
    const title = await getPageTitle(page)
    parents.push({
      id: currentPageId,
      type: page.parent.type,
      title,
    })

    // Xử lý để lấy id của parent tiếp theo
    if (page.parent.type === 'page_id') {
      currentPageId = page.parent.page_id
    } else {
      break // Tới database hoặc workspace thì dừng
    }
  }

  return parents
}

// Helper: lấy tiêu đề trang (nếu có)
async function getPageTitle (page) {
  const props = page.properties
  const titleProp = Object.values(props).find(
    p => p.type === 'title' && p.title.length > 0
  )

  if (titleProp) {
    return titleProp.title.map(t => t.plain_text).join('')
  }

  return '(No title)'
}

// 🔥 Hàm mới: lấy các "friend pages" cùng cấp (sibling pages)
export async function getSiblingPages (pageId) {
  const page = await notion.pages.retrieve({ page_id: pageId })

  // Nếu page không nằm trong page khác (vd: database), thì không có sibling kiểu này
  if (page.parent.type !== 'page_id') {
    throw new Error('Current page does not have a parent page')
  }

  const parentId = page.parent.page_id

  // Lấy children của parent
  const response = await notion.blocks.children.list({
    block_id: parentId,
  })

  const siblingPages = []

  for (const block of response.results) {
    if (block.type === 'child_page') {
      siblingPages.push({
        id: block.id,
        title: block.child_page.title,
        parentId,
        created_time: block.created_time,
      })
    }
  }

  return siblingPages
}

// 🔥 Hàm mới: lấy toàn bộ nội dung (blocks) của một page
export async function getPageBlocks (pageId) {
  const allBlocks = []
  let cursor = undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })

    allBlocks.push(...response.results)
    cursor = response.has_more ? response.next_cursor : null
  } while (cursor)

  return allBlocks
}
