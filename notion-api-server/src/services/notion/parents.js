import { notion } from '../../config/notionClient.js';

export async function getAllParentPages(pageId) {
  const parents = [];
  let currentId = pageId;

  while (true) {
    const page = await notion.pages.retrieve({ page_id: currentId });
    if (page.parent?.type === 'page_id') {
      currentId = page.parent.page_id;
      parents.push({ id: currentId });
    } else {
      break;
    }
  }

  return parents;
}