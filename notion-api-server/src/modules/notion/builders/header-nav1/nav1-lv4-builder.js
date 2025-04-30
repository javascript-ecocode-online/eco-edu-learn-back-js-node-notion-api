import { EcoBuilderBlocksMaster as Base } from '../base/builder-blocks-master.js'
import { EcoNotionNav1Lv4Comparer as Comparer } from './nav1-lv4-comparer.js'

export class EcoNotionNav1Lv4Builder extends Base {
  constructor (logCfg = {
    isDebug: false,
    name: 'EcoNotionNav1Lv4Builder',
    level: 'info',
  }) {
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
