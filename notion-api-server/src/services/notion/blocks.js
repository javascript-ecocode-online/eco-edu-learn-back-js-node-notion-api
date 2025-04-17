import { notion } from '../../config/notionClient.js';

export async function getPageBlocks(pageId) {
  const allBlocks = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });

    allBlocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);

  return allBlocks;
}