import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoNotionServiceQueryChildren as QueryService } from '../../services/notion-service-query-children.js'
import { EcoTextUtil as uTxt } from '../../../../utils/text.js'

export class EcoBuilderBlockQuery extends Base {
  _parentId
  constructor (
    parentId,
    logConfig = { isDebug: false, name: 'EcoBuilderBlockQuery', level: 'info' }
  ) {
    super(logConfig)
    this._parentId = parentId
  }
  get _blockType () {
    throw new Error('🩸 EcoBuilderBlockQuery > _blockType need implement!')
  }
  //Type of EcoNotionBuilderLv1DataText
  get _textBuilder () {
    throw new Error('Need implement _textBuilder')
  }
  get _textComparer () {
    throw new Error('Need implement _textComparer')
  }
  get _nqc () {
    return QueryService.instance
  }
  // #displayText () {
  //   const me = this
  //   const textBuilder = me._textBuilder
  //   return textBuilder.getDisplayText()
  // }

  async _findWorkingBlock (reason) {
    const me = this

    const nqc = me._nqc
    const type = me._blockType
    const parentId = me._parentId
    const textBuilder = me._textBuilder
    const tcp = me._textComparer.setTextBuilder(textBuilder).prepare()
    //Move

    const results = await nqc.getAllChildrenById(reason, parentId, type)

    const foundBlock = results?.find(block => tcp.isMatchContent(block))
    // me.logDeep('📍 ----- foundBlock: -----', foundBlock)
    const needUpdateRichText = foundBlock
      ? tcp.needUpdateRichText(foundBlock)
      : false
    const rs = {block : foundBlock, needUpdateRichText: needUpdateRichText}
    //console.log('🍋 _findWorkingBlock', rs)
    return rs
  }
}
