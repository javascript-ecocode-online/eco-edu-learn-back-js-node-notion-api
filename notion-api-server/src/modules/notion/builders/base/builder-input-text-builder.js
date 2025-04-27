import { EcoNotionBuilderDataText as Base } from './builder-data-text.js'

export class EcoNotionInputTextBuilder extends Base {
  constructor (iBlock, logCfg) {
    super(logCfg)
    this._iBlock = iBlock
  }
  getRichTextData () {
    const iBlock = this._iBlock
    //console.log('🐝 EcoNotionInputTextBuilder > getRichTextData', iBlock)
    return iBlock?.[iBlock.type]?.rich_text
  }
}
