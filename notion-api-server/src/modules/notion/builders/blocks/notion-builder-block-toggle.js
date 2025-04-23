import { EcoNotionBuilderBlockBase } from './notion-builder-block-base.js'
export class EcoNotionBuilderBlockToggle extends EcoNotionBuilderBlockBase {
  get _objectType () {
    return 'toggle'
  }

  constructor () {
    super({ name: 'EcoNotionBuilderBlockToggle', isDebug: false, level: 'info' })
  }

  setChildrenBlocks (children) {
    const me = this
    const cfg = me._oCfgSafe
    cfg['children'] = children
    return me
  }
}
