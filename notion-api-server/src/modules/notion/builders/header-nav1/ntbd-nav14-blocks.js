import { Lv0Builder } from '../base/lv0Builder.js'
import { NotionBuilderLv4ItemBuildLink } from './lv4/notion-builder-lv4-item-build-link.js'
import { NotionBuilderLv4ItemLearnLinks } from './lv4/notion-builder-lv4-item-learn-links.js'
import { NotionBuilderLv4ItemImageLink } from './lv4/notion-builder-lv4-item-image-link.js'
import { EcoNotionTaskBlockMapMention as mm } from '../../tasks/notion-task-block-map-mention.js'
// 🇻🇳 Dựng các khối hiển thị thông tin và liên kết liên quan của trang khối mention cấp độ 3 trong cấp độ 4
// 🇳🇿 Construct the relevant information and link display blocks of the 3 -level mention site in level 4
export class EcoNtbdNav14Blocks extends Lv0Builder {
  constructor (isResetChildren) {
    super({ isDebug: false, name: 'EcoNotionBuilderNav1Lv4Blocks', level: 'info' })
    this._isResetChildren = isResetChildren
  }
  // 🇻🇳 Hàm chính để dựng các khối cấp độ 4 cho cấp độ 3
  // 🇳🇿 The main function to build level 4 blocks for level 3
  async execute (blockLv3) {
    const me = this
    const blockLv3Id = blockLv3?.id
    const pageId = mm.extractFirstPageIdFromBlock(blockLv3)
    const children = await me.#getLv3ChildrenBlocks(blockLv3Id)
    await me.#addLearnLinks(blockLv3Id, children, pageId)
    await me.#addBuildLink(blockLv3Id, children, pageId)
    await me.#addImageLink(blockLv3Id, children, pageId)
  }

  // 🇻🇳 Gọi NOTION API để lấy các block con của level 3
  // 🇳🇿 Call NOTION API to get the sub -block of level 3
  async #getLv3ChildrenBlocks (blockLv3Id) {
    const nqc = this._nqc
    const reason = `🌗 #getLv3ChildrenBlocks`
    const children = await nqc.getAllChildrenById(reason, blockLv3Id)
    return children
  }

  // 🇻🇳 Tạo các khối cấp độ 4 để hiện các liên kết đến các trang học cho trang cấp độ 3 tương ứng 
  // 🇳🇿 Create level 4 blocks to show links to the studies for level 3, respectively
  async #addLearnLinks (blockLv3Id, children, targetPageId) {
    return await new NotionBuilderLv4ItemLearnLinks()
      .setIsResetChildren(this._isResetChildren)
      .setBlockLv3Id(blockLv3Id)
      .setChildren(children)
      .setTargetPageId(targetPageId)
      .build()
  }

  // 🇻🇳 Tạo các khối cấp độ 4 để hiện các liên kết đến công cụ xây dựng cho trang cấp độ 3 tương ứng 
  // 🇳🇿 Create level 4 blocks to show links to the build tool for the corresponding level 3 page 
  async #addBuildLink (blockLv3Id, children, targetPageId) {
    return await new NotionBuilderLv4ItemBuildLink()
      .setIsResetChildren(this._isResetChildren)
      .setBlockLv3Id(blockLv3Id)
      .setChildren(children)
      .setTargetPageId(targetPageId)
      .build()
  }

  // 🇻🇳 Tạo các khối cấp độ 4 để hiện tên và liên kết của ảnh bìa cho trang cấp độ 3 tương ứng 
  // 🇳🇿 Tạo các khối cấp độ 4 để hiện tên và liên kết của ảnh bìa cho trang cấp độ 3 tương ứng 
  async #addImageLink (blockLv3Id, children, targetPageId) {
    return await new NotionBuilderLv4ItemImageLink()
      .setIsResetChildren(this._isResetChildren)
      .setBlockLv3Id(blockLv3Id)
      .setChildren(children)
      .setTargetPageId(targetPageId)
      .build()
  }
}
