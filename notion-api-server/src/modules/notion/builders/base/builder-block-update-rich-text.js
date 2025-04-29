import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoNotionServiceBuildBlockAny as bb } from '../../services/notion-service-build-block-any.js'

export class EcoBuilderBlockUpdateRichText extends Base {
  _iBlock
  _eBlock
  constructor (
    ilock,
    elock,
    logConfig = { isDebug: false, name: 'EcoBuilderBlockQuery', level: 'info' }
  ) {
    super(logConfig)
    this._iBlock = ilock
    this._eBlock = elock
  }
  // 🇻🇳 Cập nhật chuỗi hiển thị block
    async #updateRichText (eBlock, richTextArr) {
      const eBlockId = eBlock?.id
      const eBlockType = eBlock?.type
      const svc = bb.instance
      const rs = await svc.updateRichText(eBlockType, eBlockId, richTextArr)
      //console.log('💥 iBlock update richTextArr s: ', rs)
      return rs
    }
  async execute () {
    const me = this
    const iBlock = me._iBlock
    const eBlock = me._eBlock
   
    const richTextArr = (iBlock?.type) ? iBlock[iBlock.type]?.rich_text : null
    
    if(!richTextArr) return null
    return await  me.#updateRichText(eBlock, richTextArr)
  }
}
