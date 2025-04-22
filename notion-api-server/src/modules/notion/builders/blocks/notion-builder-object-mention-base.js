import { EcoNotionBuilderObjectBase } from './notion-builder-object-base.js'
export class EcoNotionBuilderObjectMentionBase extends EcoNotionBuilderObjectBase {
  get _objectType () {
    return 'mention'
  }
  get _mentionType () {
    throw new Error(`Need implements ${this._logName} > _mentionType`)
  }
  
  constructor (cfg) {
    super(cfg)
    this.#applyMentionType()
  }

  #applyMentionType () {
    const me = this
    const oPropMain = me._oPropMainSafe
    oPropMain['type'] = me._mentionType
    return me
  }
  
}
