import { Nav1Lv2Builder } from './nav1Lv2.js'
import { Nav1Lv4Builder } from './nav1Lv4.js'
import { Lv1NavBuilder } from '../../lv1NavBuilder.js'
import { UrlBuilder } from '../../../../utils/builders/url-builder.js'
import { NotionJsonArrayHelper } from '../../../../utils/helpers/notion-json-array-helper.js'
export class Nav1Lv1Builder extends Lv1NavBuilder {
  
  constructor (pageId, parents, friends, children) {
    super('Nav1Lv1Builder', pageId)
    this._parents = parents
    this._friends = friends
    this._children = children
  }

  //Override
  _getMenuItemData () {
    const me = this
    const helper = NotionJsonArrayHelper
    const parentId = helper.getFirstBlockId(me._parents)
    const pageId = me._pageId
    const ub = UrlBuilder
    const items = [
      { emoji: '☝', label: '_Parent_', url: ub.buildNotionUrl(parentId) },
      { emoji: '✍️', label: '_Build_', url: ub.buildEcoBuildUrl(pageId) },
      { emoji: '👉', label: '_Learn_', url: ub.buildEcoLeanUrl(pageId) },
    ]
    return items
  }

  //Override
  _getLv2Blocks (lv1BlockId) {
    const me = this
    const lv2Builder = new Nav1Lv2Builder(
      me._pageId,
      lv1BlockId,
      me._parents,
      me._friends,
      me._children
    )
    return lv2Builder.getBlocks()
  }

  async _buildLevel3Blocks (level1BlockId, existingLv2Blocks) {
    ///const me = this;
    console.log(`--- Đang kiểm tra thêm lv3 cho block lv1: ${level1BlockId}...`)
    //const builder = new Nav1Lv4Builder()
    for (const lv2Block of existingLv2Blocks ?? []) {
      console.log('... lv2Block: ', lv2Block)
      for (const child of lv2Block.newChildren ?? []) {
        console.log('... child.toggle.rich_text: ', child.toggle.rich_text)

        for (const rt of child.toggle.rich_text ?? []) {
          console.log('... rt.mention.pagep.id: ', rt?.mention?.page?.id)
        }
      }
    }
    //console.log(existingLv2Blocks)
  }

  //Override
  async _onExecuteDone (lv1BlockId) {
    const me = this
    const nqc = me._nqc
    //console.log('> Nav1Lv1Builder > _onExecuteDone', lv1BlockId)

    const builder = new Nav1Lv4Builder()
    let reason = '_onExecuteDone > get lv2Blocks'
    const lv2Blocks = await nqc.getToggleChildrenById(reason, lv1BlockId)

    reason = '_onExecuteDone > get lv3Blocks'
    for (const lv2Block of lv2Blocks ?? []) {
      const lv3Blocks = await nqc.getToggleChildrenById(reason, lv2Block.id)
      for (const lv3Block of lv3Blocks ?? []) {
        builder.init(lv3Block).execute()
        //console.log('--- lv3Block', lv3Block)
      }
    }

    //console.log('Level 1 block id: ', blockId)
  }
}
