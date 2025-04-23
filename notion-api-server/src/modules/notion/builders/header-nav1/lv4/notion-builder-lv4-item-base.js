import { EcoBase as Base } from '../../../../../base/eco-base.js'
import { EcoNotionServiceBuildBlockToggle } from '../../../services/notion-service-build-block-toggle.js'
import { NotionIdHelper } from '../../../helpers/id/notion-id-helper.js'

export class NotionBuilderLv4ItemBase extends Base {
  _blockLv3Id
  _children
  _targetPageId
  _isResetChildren
  constructor (logConfig = 'NotionBuilderLv4ItemBase') {
    super(logConfig)
  }
  _cleanId (pageId) {
    return NotionIdHelper.cleanId(pageId)
  }
  setIsResetChildren (isResetChildren) {
    this._isResetChildren = isResetChildren
    return this
  }
  setBlockLv3Id (blockLv3Id) {
    this._blockLv3Id = blockLv3Id
    return this
  }

  setChildren (children) {
    this._children = children
    return this
  }

  setTargetPageId (targetPageId) {
    this._targetPageId = targetPageId
    return this
  }

  _hasContentLv4TextBlock (block) {
    return (
      block.type === 'paragraph' && // hoặc kiểm tra type khác nếu cần
      block.paragraph &&
      block.paragraph.rich_text &&
      block.paragraph.rich_text.length > 0
    )
  }

  async _appendToggleBlock (blockLv3Id, blockLv4) {
    const me = this
    const svc = new EcoNotionServiceBuildBlockToggle()
    const response = blockLv4
      ? await svc.appendChild(blockLv3Id, blockLv4)
      : null
    let logLbl = `✅ Text block đã được thêm vào toggle block ${blockLv3Id}:`
    me._logLines(logLbl, response.id)
    //logLbl = '> rich_text: '
    //me._logLines(logLbl, response[response.type]?.rich_text)
    return response
  }
}
