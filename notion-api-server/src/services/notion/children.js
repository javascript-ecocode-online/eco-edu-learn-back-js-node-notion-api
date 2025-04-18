import { notion } from '../../config/notionClient.js';

export async function getChildrenPages(pageId) {
  const response = await notion.blocks.children.list({ block_id: pageId });
  return response.results
    .filter(block => block.type === 'child_page')
    .map(block => ({
      id: block.id,
      title: block.child_page.title,
      created_time: block.created_time,
    }));
}

