import { EcoBase } from '../../../../base/base.js'
import { EcoNotionBuilderObjectText } from './notion-builder-object-text.js'

export class EcoNotionBuilderBlockBase extends EcoBase {
  get _objectType(){
    throw new Error(`Need implements ${this._logName} > _objectType`)
  }
  #oBlock
  #oCfg
  get _oBlockRaw () {
    const me = this
    return me.#oBlock
  }
  get _oBlockSafe () {
    const me = this
    if (!me.#oBlock) me.#oBlock = { object: 'block', type: me._objectType}
    return me.#oBlock
  }
   
  get _oCfgRaw () {
    const me = this
    return me.#oCfg
  }
  get _oCfgSafe () {
    const me = this
    if (!me.#oCfg) me.#oCfg = {}
    return me.#oCfg
  }
  constructor (cfg) {
    super(cfg)
  }
  setText (text) {
    const me = this
    const textObj = new EcoNotionBuilderObjectText().setContent(text).oObjSafe
    me.setRichTextArray([textObj])
    return me
  }
  setRichTextArray (arr) {
    const me = this
    const cfg = me._oCfgSafe
    cfg['rich_text'] = arr
    return me
  }
  
  get oBlockRaw () {
    const me = this

    const toggle = me._oCfgRaw
    const hasVal = toggle //Check more pro here
    if (hasVal) {
      const block = me._oBlockSafe
      const type = me._objectType
      block[type] = toggle
    }
    return me._oBlockRaw
  }

  get oBlockSafe () {
    const me = this
    const block = me.oBlockRaw
    return block ?? me._oBlockSafe
  }
}
