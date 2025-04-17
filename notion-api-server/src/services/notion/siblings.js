import { notion } from '../../config/notionClient.js';

export async function getSiblingPages(pageId) {
  const page = await notion.pages.retrieve({ page_id: pageId });

  if (page.parent.type !== 'page_id') {
    return [];
  }

  const parentId = page.parent.page_id;
  const response = await notion.blocks.children.list({ block_id: parentId });

  return response.results
    .filter(block => block.type === 'child_page')
    .map(block => ({
      id: block.id,
      title: block.child_page.title,
      parentId,
      created_time: block.created_time,
    }));
}