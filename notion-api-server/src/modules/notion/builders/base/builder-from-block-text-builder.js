import { EcoNotionBuilderDataText as Base } from './builder-data-text.js'

export class EcoNotionFromBlockTextBuilder extends Base {
  constructor (iBlock, logCfg) {
    super(logCfg)
    this._iBlock = iBlock
  }
  getRichTextData () {
    const iBlock = this._iBlock
    //console.log('🔥 rich_text: ', iBlock?.[iBlock.type]?.rich_text)
    //console.log('🔥 getRichTextData.toggle.rich_text: ', iBlock.toggle.rich_text)
    //console.log('🐝 EcoNotionInputTextBuilder > getRichTextData', iBlock)
    return iBlock?.[iBlock.type]?.rich_text
  }
}
