import { EcoBuilderBlocksMaster as Base } from '../base/builder-blocks-master.js'
import { EcoNotionBuilderNav1Lv4Comparer as Comparer } from './builder-nav1-lv4-comparer.js'

export class EcoNotionBuilderNav1Lv4Master extends Base {
  constructor (logCfg) {
    super(logCfg)
  }
  _getNewTextComparer () {
    return new Comparer()
  }
  async _getInputBlocks (parentBlock, parentIdChildrenMap) {
    const parentBlockId = parentBlock?.id
    const childrenBlocks = parentIdChildrenMap ? parentIdChildrenMap[parentBlockId]: []
    return childrenBlocks
  }
}
