import { notion } from '../../config/notionClient.js'


/**
 * Thêm 1 text block vào trong 1 toggle block đã tồn tại
 * @param {string} toggleBlockId - ID của toggle block
 * @param {string} text - Nội dung văn bản muốn thêm vào
 */
export async function appendTextToToggleBlock(toggleBlockId, text) {
  try {
    const response = await notion.blocks.children.append({
      block_id: toggleBlockId,
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: text,
                },
              },
            ],
          },
        },
      ],
    });

    console.log(`✅ Text block ${text} đã được thêm vào toggle block ${toggleBlockId}!`);
    return response;
  } catch (error) {
    console.error('❌ Lỗi khi thêm text vào toggle block:', error);
  }
}