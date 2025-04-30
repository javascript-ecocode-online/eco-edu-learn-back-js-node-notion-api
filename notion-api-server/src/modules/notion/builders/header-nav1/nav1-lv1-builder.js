import { Lv1NavBuilder } from '../base/lv1NavBuilder.js'
import { EcoNotionNav1Lv1RawItemsBuilder } from './nav1-lv1-raw-items-builder.js'
import { EcoNotionNav1Lv2Builder } from './nav1-lv2-builder.js'
import { EcoNotionNav1Lv1Comparer as Comparer} from './nav1-lv1-comparer.js'
export class EcoNotionNav1Lv1Builder extends Lv1NavBuilder {
  #textBuilder
  constructor (pageId, info, parents, friends, children, buildCfg) {
    super('EcoNotionNav1Lv1Builder', pageId, buildCfg)
    this._info = info
    this._parents = parents
    this._friends = friends
    this._children = children
  }
  // Override from EcoBuilderBlockQuery
  get _blockType () {
    return 'toggle'
  }
  get _textComparer () {
    return new Comparer()
  }
  // Override from EcoBuilderBlockQuery
  get _textBuilder () {
    const me = this
    if (!me.#textBuilder) {
      const pageId = me._pageId
      const parents = me._parents
      me.#textBuilder = new EcoNotionNav1Lv1RawItemsBuilder()
        .setPageId(pageId)
        .setParents(parents)
    }
    return me.#textBuilder
  }
  get _childrenBuilder () {
    const me = this
    const pageId = me._pageId
    const parents = me._parents
    const friends = me._friends
    const children = me._children
    const buildCfg = me._buildCfg
    return new EcoNotionNav1Lv2Builder()
      .setPageId(pageId)
      .setParents(parents)
      .setFriends(friends)
      .setChildren(children)
      .setBuildCfg(buildCfg)
  }
  get #isResetPages () {
    if (this._isResetChildren) return false
    return this._buildCfg?.isResetPages ?? false
  }

  get #targetRelatedPages () {
    return this._buildCfg?.targetRelatedPages
  }

  #isResetPage (pageId) {
    const me = this
    const targets = me.#targetRelatedPages
    if (!me.#isResetPages) return false
    if (!targets || targets?.length == 0) return true
    const cleanId = me._cleanId(pageId)
    const cleanTargets = targets.map(x => me._cleanId(x))
    //const logLbl = '#isResetPage'
    //me._logLines(cleanId, cleanTargets)
    return cleanTargets.includes(cleanId)
  }

  async #processExistingLv3Block (lv3Block, existingRelatedPageIds) {
    const me = this
    const svc = me._anyBlockSvc
    let logLbl = ''
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
        if (lv3MentionType == 'page') {
          const targetRelatedPageId = rt[rt.type]?.page?.id
          existingRelatedPageIds.push(targetRelatedPageId)
          if (me.#isResetPage(targetRelatedPageId)) {
            logLbl = `🙏 will reset page`
            me._logLines(logLbl, targetRelatedPageId)
            await me._removeChildren(lv3Block)
          } else {
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

  async #processNewv3Block (child, newRelatedPageIds) {
    const me = this
    //logLbl = '🌴 Lv2 Block > newChildren > rich_text'
    //{ object: 'block', type: 'toggle', toggle: { rich_text: [Array] } },
    //me._logLines(logLbl, child.toggle.rich_text)
    let logLbl = ''

    for (const rt of child.toggle.rich_text ?? []) {
      if (rt.type === 'mention') {
        const oMention = rt[rt.type]
        if (oMention.type == 'page') {
          logLbl = '🚥 Lv2 Block > newChildren > rich_text > page id'
          const relatedPageId = oMention[oMention.type].id
          newRelatedPageIds.push(relatedPageId)
          me._logLines(logLbl, relatedPageId)
        } else {
          logLbl = `🚥 Lv2 Block > newChildren > rich_text > ${oMention.type}`
          me._logLines(logLbl, oMention[oMention.type])
        }
      } else if (rt.type == 'text') {
        logLbl = '🦯 Lv2 Block > newChildren > rich_text > text'
        me._logLines(logLbl, rt[rt.type].content)
      }
    }
  }

  async #processLv2BlockNewChildren (newChildren) {
    const me = this

    const newRelatedPageIds = []
    if (!newChildren) return newRelatedPageIds

    for (const child of newChildren ?? []) {
      await me.#processNewv3Block(child, newRelatedPageIds)
    }
    return newRelatedPageIds
  }

  async #processLv2BlockExistingChildren (lv2Block) {
    const me = this
    const existingRelatedPageIds = []
    if (!lv2Block.has_children) return existingRelatedPageIds

    const existingLv3Blocks = await me.#getLevel3ExistingBlocks(lv2Block.id)
    for (const lv3Block of existingLv3Blocks ?? []) {
      await me.#processExistingLv3Block(lv3Block, existingRelatedPageIds)
    }
    return existingRelatedPageIds
  }

  #getMissingId (arr1, arr2) {
    return arr1.filter(id => !arr2.includes(id))
  }

  async _buildLv3BlocksForExtgLv2Blocks (lv1BlockId, lv2ExtgBlocks) {
    const me = this

    let logLbl = 'Đang xử lý _buildLv3BlocksForExtgLv2Blocks cho block Lv1: '
    me._logLines(logLbl, lv1BlockId)

    for (const lv2Block of lv2ExtgBlocks ?? []) {
      const lv2BlockId = lv2Block.id
      const fullRelatedPageIds = await me.#processLv2BlockNewChildren(
        lv2Block.newChildren
      )
      const existingRelatedPageIds = await me.#processLv2BlockExistingChildren(
        lv2Block
      )

      const needAppendRefPageIds = me.#getMissingId(
        fullRelatedPageIds,
        existingRelatedPageIds
      )
      const needRemoveRefPageIds = me.#getMissingId(
        existingRelatedPageIds,
        fullRelatedPageIds
      )
      me._logLines(fullRelatedPageIds, existingRelatedPageIds)
      logLbl = `🥑 getNeedAppendRelatedPageIds: ${lv2BlockId}`
      me._logLines(logLbl, needAppendRefPageIds)

      logLbl = `🥑 getNeedRemoveRelatedPageIds: ${lv2BlockId}`
      me._logLines(logLbl, needRemoveRefPageIds)
    }
  }

  async #getLevel3ExistingBlocks (blockId) {
    const me = this
    const nqc = me._nqc
    const reason = 'EcoNotionBuilderNav1Lv1 > #getLevel3ExistingBlocks'
    const lv3ExistingAllBlocks = await nqc.getAllChildrenById(reason, blockId)
    return lv3ExistingAllBlocks
  }

  

}
