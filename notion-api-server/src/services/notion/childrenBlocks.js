import { notion } from '../../config/notionClient.js';

export async function getChildrenToggleBlocks(blockId) {
    const response = await notion.blocks.children.list({ block_id: blockId });
    return response.results
      .filter(block => block.type === 'toggle')
      // .map(block => ({
      //   id: block.id,
      //   title: block.child_page.title,
      //   created_time: block.created_time,
      // }));
  }