import { EcoBuilderBlockFind as Base } from './builder-block-find.js'
import { EcoNotionServiceBuildBlockAny as bb } from '../../../services/notion-service-build-block-any.js'
/**
 * 🇻🇳 Lớp này làm lớp cha chứa các hàm xử lý 1 block
 * @class
 */
export class EcoBuilderBlockFindUpdate extends Base {
  _foundBlock
  constructor (
    parentId,
    logConfig = { isDebug: false, name: 'EcoBuilderBlockCrud', level: 'info' }
  ) {
    super(parentId, logConfig)
  }

  get _childrenBuilder () {
    throw new Error('Lv1Builder > #lv2BuilderMaster need implement!')
  }

  // 🇻🇳 Cập nhật chuỗi hiển thị block
  async _updateBlockText (block) {
    const me = this
    const textBuilder = me._textBuilder
    const type = me._blockType
    const svc = bb.instance
    const richTextArr = textBuilder.getRichTextData()
    
    return await svc.updateRichText(type, block.id, richTextArr)
  }
  async execute (lv = 1) {
    const me = this
    let rs = {}
    let findResult = await me._findWorkingBlock(
      'EcoBuilderBlockFindUpdate > execute'
    )
   
    let block = findResult.block
    me._foundBlock = block
    let needUpdateRichText = findResult.needUpdateRichText
    if (!block) return rs
    if (needUpdateRichText) block = await me._updateBlockText(block)
    rs[`level-${lv}-rs`] = block
    const childrenBuilder = me._childrenBuilder
    if (childrenBuilder) {
      await childrenBuilder.execute(lv + 1, block, rs)
    }
   
    return rs
  }
}
