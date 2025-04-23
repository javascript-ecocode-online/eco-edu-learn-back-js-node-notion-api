import { Lv0Builder } from '../base/lv0Builder.js'
import { NotionBuilderLv4ItemBuildLink } from './lv4/notion-builder-lv4-item-build-link.js'
import { NotionBuilderLv4ItemLearnLinks } from './lv4/notion-builder-lv4-item-learn-links.js'
import { NotionBuilderLv4ItemImageLink } from './lv4/notion-builder-lv4-item-image-link.js'
export class EcoNotionBuilderNav1Lv4 extends Lv0Builder {
  constructor (isResetChildren) {
    super('EcoNotionBuilderNav1Lv4')
    this._isResetChildren = isResetChildren
  }

  async execute (blockLv3) {
    const me = this
    const blockLv3Id = blockLv3?.id
    const targetPageId = me.#getToggleMentionPageId(blockLv3)
    const children = await me.#getLv3ChildrenBlocks(blockLv3Id)
    await me.#addLearnLinks(blockLv3Id, children, targetPageId)
    await me.#addBuildLink(blockLv3Id, children, targetPageId)
    await me.#addImageLink(blockLv3Id, children, targetPageId)
  }

  #getToggleMentionPageId (block) {
    const rs = block?.toggle?.rich_text
      .filter(
        textItem =>
          textItem.type === 'mention' && textItem.mention.type === 'page'
      )
      .map(textItem => {
        //console.log('>: ', textItem)
        return textItem.mention.page.id
      })
      .join('')

    return rs
  }

  async #getLv3ChildrenBlocks (toggleBlockId) {
    const nqc = this._nqc
    // Lấy danh sách block con của toggle block
    const reason = `${this._name} #getLv3ChildrenBlocks`
    const children = await nqc.getAllChildrenById(reason, toggleBlockId)
    return children
  }

  async #addLearnLinks (blockLv3Id, children, targetPageId) {
    return await new NotionBuilderLv4ItemLearnLinks()
      .setIsResetChildren(this._isResetChildren)
      .setBlockLv3Id(blockLv3Id)
      .setChildren(children)
      .setTargetPageId(targetPageId)
      .build()
  }

  async #addBuildLink (blockLv3Id, children, targetPageId) {
    return await new NotionBuilderLv4ItemBuildLink()
      .setIsResetChildren(this._isResetChildren)
      .setBlockLv3Id(blockLv3Id)
      .setChildren(children)
      .setTargetPageId(targetPageId)
      .build()
  }

  async #addImageLink (blockLv3Id, children, targetPageId) {
    return await new NotionBuilderLv4ItemImageLink()
      .setIsResetChildren(this._isResetChildren)
      .setBlockLv3Id(blockLv3Id)
      .setChildren(children)
      .setTargetPageId(targetPageId)
      .build()
  }
}
