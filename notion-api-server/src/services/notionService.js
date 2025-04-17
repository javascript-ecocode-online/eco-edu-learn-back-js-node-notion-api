import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Hàm lấy danh sách children pages của một page
export async function getChildrenPages(pageId) {
  const response = await notion.blocks.children.list({
    block_id: pageId,
  });
  return response.results;
}

// Hàm lấy nội dung 1 trang (basic)
export async function getPageContent(pageId) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  return page;
}

// (Thêm hàm khác ở đây nếu cần: getParentPages, getSiblings, ...)