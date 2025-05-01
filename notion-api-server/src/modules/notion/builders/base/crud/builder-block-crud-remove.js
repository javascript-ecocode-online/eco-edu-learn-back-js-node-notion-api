import { EcoBase as Base } from '../../../../../base/eco-base.js'
import { EcoNotionServiceBuildBlockAny as bb } from '../../../services/notion-service-build-block-any.js'

export class EcoBuilderBlockCrudRemove extends Base {
  _eBlock
  constructor (
    eBlock,
    logConfig = { isDebug: false, name: 'EcoBuilderBlockCrudRemove', level: 'info' }
  ) {
    super(logConfig)
    this._eBlock = eBlock
  }

  async execute () {
    const me = this
    const eBlock = me._eBlock
    const svc = bb.instance
    const rs = await svc.removeBlockAndChildren(eBlock)
    return rs
  }
}
