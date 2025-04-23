import { EcoNotionBuilderNav1Lv2 } from './notion-builder-nav1-lv2.js'
import { EcoNotionBuilderNav1Lv4 } from './notion-builder-nav1-lv4.js'
import { Lv1NavBuilder } from '../base/lv1NavBuilder.js'
import { UrlBuilder } from '../../../../utils/builders/url-builder.js'
import { NotionJsonArrayHelper } from '../../../../utils/helpers/notion-json-array-helper.js'
import { EcoNotionTemplateLv1 } from '../../templates/notion-template-lv1.js'
export class EcoNotionBuilderNav1Lv1 extends Lv1NavBuilder {
  constructor (pageId, info, parents, friends, children, buildCfg) {
    super('EcoNotionBuilderNav1Lv1', pageId, buildCfg)
    this._info = info
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
    const tpl = EcoNotionTemplateLv1.nav1Template
    const items = [
      {
        emoji: tpl.parent.emoji,
        label: tpl.parent.label,
        url: ub.buildNotionUrl(parentId),
      },
      {
        emoji: tpl.build.emoji,
        label: tpl.build.label,
        url: ub.buildEcoBuildUrl(pageId),
      },
      {
        emoji: tpl.learn.emoji,
        label: tpl.learn.label,
        url: ub.buildEcoLeanUrl(pageId),
      },
    ]
    return items
  }

  //Override
  _getLv2Blocks (lv1BlockId) {
    const me = this
    const lv2Builder = new EcoNotionBuilderNav1Lv2(
      me._pageId,
      lv1BlockId,
      me._parents,
      me._friends,
      me._children
    )
    return lv2Builder.getBlocks()
  }

  async _buildLevel3Blocks (level1BlockId, existingLv2Blocks) {
    // for (const lv2Block of existingLv2Blocks ?? []) {
    //   for (const child of lv2Block.newChildren ?? []) {
    //     for (const rt of child.toggle.rich_text ?? []) {
    //     }
    //   }
    // }
  }

  //Override
  async _onExecuteDone (lv1BlockId) {
    const me = this
    const nqc = me._nqc

    const builder = new EcoNotionBuilderNav1Lv4(me._isResetChildren)
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
