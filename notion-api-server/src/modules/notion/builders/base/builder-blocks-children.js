import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoNotionServiceQueryChildren as QueryService } from '../../services/notion-service-query-children.js'
import { NotionMissionBlocksCompare } from './notion-mission-blocks-compare.js'
import { EcoNotionFromBlockTextBuilder } from './builder-from-block-text-builder.js'
//TODO: change import
import { EcoNotionServiceBuildBlockToggle } from '../../services/notion-service-build-block-toggle.js'
import { EcoBuilderBlockUpdateRichText as Updater } from './builder-block-update-rich-text.js'
import { EcoBuilderBlockCrudRemove as Remover } from './builder-block-crud-remove.js'
import { EcoBuilderBlockCrudAdd as Appender } from './builder-block-crud-add.js'
export class EcoBuilderBlocksChildren extends Base {
  constructor (
    logConfig = {
      isDebug: false,
      name: 'EcoBuilderBlocksChildren',
      level: 'info',
    }
  ) {
    super(logConfig)
  }
  get _nqc () {
    return QueryService.instance
  }
  // Có thể override: luôn true / luôn false / tự động tính

  //   get _isResetChildren () {
  //     return false
  //   }
  async _getInputBlocks () {
    throw new Error('Need implement _getLv2Blocks')
  }

  _getNewTextComparer () {
    throw new Error('Need implement _getBlockComparer')
  }

  // Can override
  _getFromBlockTextBuilder (iBlock) {
    return new EcoNotionFromBlockTextBuilder(iBlock)
  }

  // Can override
  _getBlocksComparer () {
    const me = this

    const cs = new NotionMissionBlocksCompare((index, iBlock) => {
      console.log('🥂 _getTextComparer for: ', index)
      const comparer = me._getNewTextComparer()
      const textBuilder = me._getFromBlockTextBuilder(iBlock)
      return comparer.setTextBuilder(textBuilder).prepare()
    })
    return cs
  }

  async _removeChildren (block) {
    if (!block.has_children) return block
    const svc = new EcoNotionServiceBuildBlockToggle()
    return await svc.deleteAllChildBlocks(block.id)
  }

  async #getAllExistingBlocks (blockId) {
    const me = this
    const nqc = me._nqc
    const reason = 'EcoBuilderBlocksChildren > #getAllExistingBlocks'

    const existingAllBlocks = await nqc.getAllChildrenById(reason, blockId)
    return existingAllBlocks
  }
  #compareBlocks (iBlocks, eBlocks) {
    const me = this
    const cs = me._getBlocksComparer()
    return cs.compareNotionBlocks(iBlocks, eBlocks)
  }
  async #processUpdateRichText (e) {
    const u = new Updater(e.iBlock, e.eBlock)
    return await u.execute()
  }
  async #processRemoveBlock (eBlock) {
    const u = new Remover(eBlock)
    return await u.execute()
  }
  async #processAddBlock (parentId, iBlock) {
    if(iBlock && iBlock[iBlock?.type]?.children){
        iBlock[iBlock.type].children = undefined
    }
    const u = new Appender(parentId, iBlock)
    return await u.execute()
  }
  #processNeedChangeRichTextBlocks (promises, rsCompare) {
    const me = this
    const arr = rsCompare?.needChangeRichTextBlocks
    if (arr?.length) {
      //console.log('🔥 needChangeRichTextBlocks', arr)
      arr.forEach((e, i) => {
        const promise = me.#processUpdateRichText(e)
        promises.push(promise)
      })
    }
    return me
  }

  #removeRemoveAndRepaceBlocks (promises, rsCompare) {
    const me = this
    const removeBlocks = rsCompare?.needRemoveBlocks
    const replaceBlocks = rsCompare?.needReplaceBlocks.map(b => b.eBlock)
    if (removeBlocks?.length) {
      removeBlocks?.forEach((eBlock, i) => {
        //console.log('🔥 remove removeBlock ', eBlock)
        const promise = me.#processRemoveBlock(eBlock)
        promises.push(promise)
      })
    }
    if (replaceBlocks?.length) {
      replaceBlocks?.forEach((eBlock, i) => {
        //console.log('🔥 remove replaceBlock ', eBlock)
        const promise = me.#processRemoveBlock(eBlock)
        promises.push(promise)
      })
    }
    return me
  }
  async #processAddNeedAddAndReplaceBlocks (addResults, parentId, rsCompare) {
    const me = this
    const needReplaceBlocks = rsCompare?.needReplaceBlocks
    const needAddBlocks = rsCompare?.needAddBlocks
    if (needReplaceBlocks?.length) {
      console.log('🔥 add > needReplaceBlocks', needReplaceBlocks)

      for (const obj of needReplaceBlocks) {
        const addReplaceRs = await me.#processAddBlock(parentId, obj.iBlock)
        addResults.push(addReplaceRs)
      }
    }
    if (needAddBlocks?.length) {
      console.log('🔥 add > needAddBlocks', needAddBlocks)
      for (const iBlock of needAddBlocks) {
        const addNewRs = await me.#processAddBlock(parentId, iBlock)
        addResults.push(addNewRs)
      }
    }
    return me
  }

  async #processCompareResult (parentId, rsCompare) {
    const me = this
    const rs = {}
    if (rsCompare.isEqualAll) {
      rs.isEqualAll = true
      return rs
    }
    console.log('rsCompare', rsCompare)

    const updatePromises = []
    me.#processNeedChangeRichTextBlocks(updatePromises, rsCompare)
    const updateResults = updatePromises.length
      ? await Promise.all(updatePromises)
      : null
    rs.UpdateResults = updateResults

    const removePromises = []
    me.#removeRemoveAndRepaceBlocks(removePromises, rsCompare)
    const removeResults = removePromises.length
      ? await Promise.all(removePromises)
      : null
    rs.RemoveResults = removeResults

    const addResults = []
    await me.#processAddNeedAddAndReplaceBlocks(addResults, parentId, rsCompare)

    rs.AddResults = addResults

    //TODO: Process children for all blocks
    return rs
  }
  async execute (lv, block, rs) {
    if (!block) return
    //console.log('🌻 execute children of', block)
    const me = this

    const blockId = block.id
    const eBlocks = await me.#getAllExistingBlocks(blockId)
    //console.log('eBlocks', eBlocks)

    const iBlocks = me._getInputBlocks(blockId)
    //console.log('iBlocks', iBlocks)

    const rsCompare = me.#compareBlocks(iBlocks, eBlocks)
    const results = await me.#processCompareResult(blockId, rsCompare)

    //if (me._isResetChildren) {
    //block = await me._removeChildren(block)
    //}
  }
}
