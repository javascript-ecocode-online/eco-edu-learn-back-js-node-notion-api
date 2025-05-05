import { EcoNotionBuilderDataText as Base } from './builder-data-text.js'

export class EcoNotionFromBlockTextBuilder extends Base {
  constructor (iBlock, logCfg) {
    super(logCfg)
    this._iBlock = iBlock
  }
  getRichTextData () {
    const iBlock = this._iBlock
    return iBlock?.[iBlock.type]?.rich_text
  }
}
