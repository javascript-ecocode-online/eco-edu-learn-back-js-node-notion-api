import { EcoNotionBuilderNav1Lv2 } from './notion-builder-nav1-lv2.js'
import { EcoNotionBuilderNav1Lv4 } from './notion-builder-nav1-lv4.js'
import { Lv1NavBuilder } from '../base/lv1NavBuilder.js'
import { NotionIdHelper as nId} from '../../helpers/id/notion-id-helper.js'
import { NotionUrlHelper as nUrl } from '../../helpers/id/notion-url-helper.js'
import { EcoUrlHelper as eUrl } from '../../../eco/helpers/eco-txt-url-helper.js'
import { NotionJsonArrayHelper } from '../../helpers/notion-object-array-helper.js'
import { EcoNotionTemplateLv1 } from '../../templates/notion-template-lv1.js'
export class EcoNotionBuilderNav1Lv1 extends Lv1NavBuilder {
  constructor (pageId, info, parents, friends, children, buildCfg) {
    super('EcoNotionBuilderNav1Lv1', pageId, buildCfg)
    this._info = info
    this._parents = parents
    this._friends = friends
    this._children = children
  }

  get #isResetPages () {
    if(this._isResetChildren) return false
    return this._buildCfg?.isResetPages ?? false
  }

  get #targetRelatedPages () {
    return this._buildCfg?.targetRelatedPages
  }

  #isResetPage (pageId) {
    const me = this
    const targets = me.#targetRelatedPages
    if(!me.#isResetPages) return false
    if(!targets || targets?.length == 0 ) return true
    const cleanId = me._cleanId(pageId)
    const cleanTargets = targets.map(x => me._cleanId(x))
    //const logLbl = '#isResetPage'
    //me._logLines(cleanId, cleanTargets)
    return cleanTargets.includes(cleanId)
  }

  //Override
  _getMenuItemData () {
    const me = this
    const helper = NotionJsonArrayHelper
    const parentId = helper.getFirstBlockId(me._parents)
    const pageId = me._pageId
    const tpl = EcoNotionTemplateLv1.nav1Template
    const cleanId = nId.cleanId(pageId)
    const items = [
      {
        emoji: tpl.parent.emoji,
        label: tpl.parent.label,
        url: nUrl.getNotionUrl(parentId),
      },
      {
        emoji: tpl.build.emoji,
        label: tpl.build.label,
        url: eUrl.getEcoBuildUrl(cleanId),
      },
      {
        emoji: tpl.learn.emoji,
        label: tpl.learn.label,
        url: eUrl.getEcoLearnUrl(cleanId),
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
    const me = this
    const svc = me._anyBlockSvc
    let logLbl = ''
    for (const lv2Block of existingLv2Blocks ?? []) {
      //if (!lv2Block.has_children) {
      //logLbl = '🪭 Lv2 Block:'
      //me._logLines(logLbl, lv2Block)

      for (const child of lv2Block.newChildren ?? []) {
        //logLbl = '🌴 Lv2 Block > newChildren > rich_text'
        //{ object: 'block', type: 'toggle', toggle: { rich_text: [Array] } },
        //me._logLines(logLbl, child.toggle.rich_text)

        for (const rt of child.toggle.rich_text ?? []) {
          if (rt.type == 'mention') {
            //logLbl = '⚡️ Lv2 Block > newChildren > rich_text > page'
            //me._logLines(logLbl, rt[rt.type].page)
          } else if (rt.type == 'text') {
            //logLbl = '🦯 Lv2 Block > newChildren > rich_text > text'
            //me._logLines(logLbl, rt[rt.type].content)
          }
        }
      }

      const lv2BlockId = lv2Block.id
      if (lv2Block.has_children) {
        const existingLv3Blocks = await me.#getLevel3ExistingBlocks(lv2BlockId)

        for (const lv3Block of existingLv3Blocks ?? []) {
          //logLbl = '--- 🍒 _buildLevel3Blocks > existingLv3Block ---'
          //me._logLines(logLbl, lv3Block)

          const lv3BlockId = lv3Block.id


          const lv3BlockType = lv3Block.type
          const richText = lv3Block[lv3BlockType].rich_text
          //logLbl = `🌷 Lv3 Block > ${lv3BlockType} > rich_text`
          //me._logLines(logLbl, richText)
          if (lv3BlockType === 'toggle') {

            for (const rt of richText) {
              const lv3MentionType = rt[rt.type]?.type
              if(lv3MentionType == 'page'){
                const targetRelatedPageId = rt[rt.type]?.page?.id
                
                if(me.#isResetPage(targetRelatedPageId)){
                  logLbl = `🙏 will reset page`
                  me._logLines(logLbl, targetRelatedPageId)
                  await me._removeChildren(lv3Block)
                }else{
                   logLbl = `🐟 no reset page`
                  me._logLines(logLbl, targetRelatedPageId)
                }
              }
            }

          
          
          } else {
            await svc.deleteBlock(lv3BlockId)
            logLbl = '⛳️ Lv3 Block > deleted: '
            me._logLines(logLbl, lv3BlockId, lv3Block[lv3Block.type].rich_text)
          }

         
        }
      }

      //}
    }
  }

  async #getLevel3ExistingBlocks (blockId) {
    const me = this
    const nqc = me._nqc
    const reason = 'EcoNotionBuilderNav1Lv1 > #getLevel3ExistingBlocks'
    const lv3ExistingAllBlocks = await nqc.getAllChildrenById(reason, blockId)
    return lv3ExistingAllBlocks
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
      const lv2BlockId = lv2Block.id

      const lv3Blocks = await nqc.getToggleChildrenById(reason, lv2BlockId)
      for (const lv3Block of lv3Blocks ?? []) {
       await builder.execute(lv3Block)
        //console.log('--- lv3Block', lv3Block)
      }
    }

    //console.log('Level 1 block id: ', blockId)
  }
}
