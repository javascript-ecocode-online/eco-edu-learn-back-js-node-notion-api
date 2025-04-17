import { notion } from '../../config/notionClient.js';

export async function getAllParentPages(pageId) {
  const parents = [];
  let currentId = pageId;

  while (true) {
    const page = await notion.pages.retrieve({ page_id: currentId });

    // Lưu thông tin trang hiện tại
    const currentInfo = {
      id: currentId,
      type: page.object,
      title: extractTitle(page),
    };
    parents.push(currentInfo);

    if (page.parent?.type === 'page_id') {
      currentId = page.parent.page_id;
    } else {
      break;
    }
  }

  return parents;
}

// 🔍 Trích xuất tiêu đề của page (nếu có)
function extractTitle(page) {
  if (!page.properties) return null;

  const titleProp = Object.values(page.properties).find(
    (prop) => prop.type === 'title'
  );

  if (titleProp && titleProp.title.length > 0) {
    return titleProp.title.map(part => part.plain_text).join('');
  }

  return null;
}