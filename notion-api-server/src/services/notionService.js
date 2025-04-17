import { Client } from "@notionhq/client";
require("dotenv").config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default { notion };