import { EcoBuilderBlockQuery as Base } from './builder-block-query.js'
import { EcoNotionServiceBuildBlockAny as bb } from '../../services/notion-service-build-block-any.js'
/**
 * 🇻🇳 Lớp này làm lớp cha chứa các hàm xử lý 1 block
 * @class
 */
export class EcoBuilderBlockFindUpdate extends Base {
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
      'EcoNotionBuilderLv1Master > execute'
    )
    let block = findResult.block
    let needUpdateRichText = findResult.needUpdateRichText
    if (!block) return rs
    if (needUpdateRichText) block = await me._updateBlockText(block)
    rs[`level-${lv}`] = block
    const childrenBuilder = me._childrenBuilder
    if (childrenBuilder) {
      await childrenBuilder.execute(lv, block, rs)
    }

    //await me._onExecuteDone(lv1BlockId)
    //TODO:
    return rs
  }
}
