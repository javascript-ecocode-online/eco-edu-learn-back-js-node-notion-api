import { EcoBuilderBlocksMaster as Base } from '../base/builder-blocks-master.js'
import { EcoNotionParagraphLv4Comparer as Comparer } from './paragraph-lv4-comparer.js'

export class EcoNotionParagraphLv4Builder extends Base {
  constructor (logCfg = {
    isDebug: false,
    name: 'EcoNotionParagraphLv4Builder',
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
