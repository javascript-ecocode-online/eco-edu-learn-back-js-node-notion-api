import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoNotionServiceQueryChildren as QueryService } from '../../services/notion-service-query-children.js'
import { NotionMissionBlocksCompare } from '../../missions/notion-mission-blocks-compare.js'
import { EcoNotionFromBlockTextBuilder } from './builder-from-block-text-builder.js'
//TODO: change import
import { EcoNotionServiceBuildBlockToggle } from '../../services/notion-service-build-block-toggle.js'
import { EcoBuilderBlockUpdateRichText as Updater } from './builder-block-update-rich-text.js'
import { EcoBuilderBlockCrudRemove as Remover } from './builder-block-crud-remove.js'
import { EcoBuilderBlockCrudAdd as Appender } from './builder-block-crud-add.js'
export class EcoBuilderBlocksMaster extends Base {
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

  get _childrenBuilder () {
    return undefined
  }

  async _getInputBlocks (block, parentIdChildrenMap) {
    throw new Error('Need implement _getInputBlocks')
  }

  _getNewTextComparer () {
    throw new Error('Need implement _getNewTextComparer')
  }

  // Can override
  _getFromBlockTextBuilder (iBlock) {
    return new EcoNotionFromBlockTextBuilder(iBlock)
  }

  // Can override
  _getBlocksComparer () {
    const me = this

    const cs = new NotionMissionBlocksCompare((index, iBlock) => {
      //console.log('🥂 _getTextComparer for: ', index)
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
    let children = undefined
    if (iBlock && iBlock[iBlock?.type]?.children) {
      children = iBlock[iBlock.type].children
      iBlock[iBlock.type].children = undefined
    }
    const u = new Appender(parentId, iBlock)
    const block = await u.execute()
    if (children) {
      iBlock[iBlock.type].children = children
    }
    return block
  }
  async #processNeedChangeRichTextBlocks (rsCompare) {
    const me = this
    const updateResults = []
    const arr = rsCompare?.needChangeRichTextBlocks
    if (arr?.length) {
      //console.log('🔥 needChangeRichTextBlocks', arr)

      for (const e of arr) {
        const updateResult = await me.#processUpdateRichText(e)
        updateResults.push(updateResult)
      }
    }
    return updateResults
  }

  async #removeRemoveAndRepaceBlocks (rsCompare) {
    const me = this
    const removeResults = []
    const removeBlocks = rsCompare?.needRemoveBlocks
    const replaceBlocks = rsCompare?.needReplaceBlocks.map(b => b.eBlock)
    if (removeBlocks?.length) {
      for (const eBlock of removeBlocks) {
        const removeResult = await me.#processRemoveBlock(eBlock)
        removeResults.push(removeResult)
      }
    }
    if (replaceBlocks?.length) {
      for (const eBlock of replaceBlocks) {
        const removeResult = await me.#processRemoveBlock(eBlock)
        removeResults.push(removeResult)
      }
    }
    return removeResults
  }
  async #processAddNeedAddAndReplaceBlocks (parentId, rsCompare, idChildrenMap) {
    const me = this
    const addResults = []
    //#prepareIdChildrenMapForBlock
    const needReplaceBlocks = rsCompare?.needReplaceBlocks
    const needAddBlocks = rsCompare?.needAddBlocks
    if (needReplaceBlocks?.length) {
      //console.log('🔥 add > needReplaceBlocks', needReplaceBlocks)

      for (const obj of needReplaceBlocks) {
        const addReplaceRs = await me.#processAddBlock(parentId, obj.iBlock)
        //console.log('🔥 add for replace', addReplaceRs)
        me.#prepareIdChildrenMapForBlock(
          idChildrenMap,
          addReplaceRs,
          obj.iBlock
        )
        addResults.push(addReplaceRs)
      }
    }
    if (needAddBlocks?.length) {
      for (const iBlock of needAddBlocks) {
        const addNewRs = await me.#processAddBlock(parentId, iBlock)
        //console.log('🔥 add for add', addNewRs)
        me.#prepareIdChildrenMapForBlock(idChildrenMap, addNewRs, iBlock)
        addResults.push(addNewRs)
      }
    }
    return addResults
  }

  async #processCompareResult (parentId, rsCompare, idChildrenMap) {
    const me = this
    const rs = {}
    if (rsCompare.isEqualAll) {
      rs.isEqualAll = true
      return rs
    }
    rs.UpdateResults = await me.#processNeedChangeRichTextBlocks(rsCompare)
    rs.RemoveResults = await me.#removeRemoveAndRepaceBlocks(rsCompare)
    rs.AddResults = await me.#processAddNeedAddAndReplaceBlocks(
      parentId,
      rsCompare,
      idChildrenMap
    )
    return rs
  }

  #prepareIdChildrenMapForArr (idChildrenMap, arr) {
    const me = this
    arr?.forEach((obj, idx) => {
      me.#prepareIdChildrenMapForObj(idChildrenMap, obj)
    })
  }
  #prepareIdChildrenMapForObj (idChildrenMap, obj) {
    const me = this
    me.#prepareIdChildrenMapForBlock(idChildrenMap, obj?.eBlock, obj?.iBlock)
    if (obj?.eBlock?.id && obj?.iBlock?.type) {
      idChildrenMap[obj.eBlock.id] = obj.iBlock[obj.iBlock.type].children
    }
  }
  #prepareIdChildrenMapForBlock (idChildrenMap, eBlock, iBlock) {
    if (eBlock?.id && iBlock?.type) {
      idChildrenMap[eBlock.id] = iBlock[iBlock.type].children
    }
  }
  #prepareIdChildrenMap (rsCompare) {
    const me = this
    const idChildrenMap = {}

    me.#prepareIdChildrenMapForArr(idChildrenMap, rsCompare?.skipBlocks)
    me.#prepareIdChildrenMapForArr(
      idChildrenMap,
      rsCompare?.needChangeRichTextBlocks
    )

    //console.log('🐞 rsCompare', rsCompare)
    //console.log('🐞 idChildrenMap', idChildrenMap)
    return idChildrenMap
  }
  async execute (lv, block, rs, parentIdChildrenMap) {
    if (!block) return
    //if (lv > 3) return
    console.log()
    console.log(
      `🍒 ***** execute children at level ${lv} for block: *****`,
      block?.id
    )
    const me = this

    const blockId = block.id
    const eBlocks = await me.#getAllExistingBlocks(blockId)
    //console.log('eBlocks', eBlocks)

    const iBlocks = await me._getInputBlocks(block, parentIdChildrenMap)

    const rsCompare = me.#compareBlocks(iBlocks, eBlocks)
    
    const idChildrenMap = me.#prepareIdChildrenMap(rsCompare)
    const nextLevel = lv + 1
    if (rsCompare.isEqualAll) {
      console.log('🌓 > rsCompare', 'equal all')
      await me.#runNextLevel(nextLevel, eBlocks, rs, idChildrenMap)
    } else {
      console.log('🌓 > rsCompare', rsCompare)
      const results = await me.#processCompareResult(
        blockId,
        rsCompare,
        idChildrenMap
      )
      rs[`level-${lv}-rs`] = results
      const finalBlocks = await me.#getAllExistingBlocks(blockId)
      await me.#runNextLevel(nextLevel, finalBlocks, rs, idChildrenMap)
    }
  }

  async #runNextLevel (nextLevel, eBlocks, rs, idChildrenMap) {
    const me = this

    if (!eBlocks) return
    for (const eBlock of eBlocks ?? []) {
      const master = me._childrenBuilder
      if (master?.execute)
        await master.execute(nextLevel, eBlock, rs, idChildrenMap)
    }
  }
}
