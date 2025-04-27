import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoNotionServiceQueryChildren as QueryService } from '../../services/notion-service-query-children.js'
import { NotionMissionBlocksCompare } from './notion-mission-blocks-compare.js'

//TODO: change import
import { EcoNotionServiceBuildBlockToggle } from '../../services/notion-service-build-block-toggle.js'

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

  get _textComparer () {
    throw new Error('Need implement _getBlockComparer')
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
  #compareBlocks(iBlocks, eBlocks){
    const me = this
    const textComparer = me._textComparer
    const cs = new NotionMissionBlocksCompare(textComparer)
    const rsCompare = cs.compareNotionBlocks(iBlocks, eBlocks)
    return rsCompare
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
    console.log('rsCompare', rsCompare)
    //if (me._isResetChildren) {
    //block = await me._removeChildren(block)
    //}
  }
}
