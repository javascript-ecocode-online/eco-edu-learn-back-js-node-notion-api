import { EcoBase as Base } from '../../../../../base/eco-base.js'
import { EcoNotionServiceBuildBlockParent as bb } from '../../../services/notion-service-build-block-parent.js'

export class EcoBuilderBlockCrudAdd extends Base {
  _parentId
  _iBlock
  constructor (
    parentId,
    iBlock,
    logConfig = {
      isDebug: false,
      name: 'EcoBuilderBlockCrudAdd',
      level: 'info',
    }
  ) {
    super(logConfig)
    this._parentId = parentId
    this._iBlock = iBlock
  }

  async execute () {
    const me = this
    const parentId = me._parentId
    const iBlock = me._iBlock
    const svc = bb.instance
    const rs = await svc.appendChild(parentId, iBlock)
    return rs
  }
}
