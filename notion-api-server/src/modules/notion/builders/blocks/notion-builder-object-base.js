import { EcoBase } from '../../../../base/base.js'
export class EcoNotionBuilderObjectBase extends EcoBase {
  #oObj
  #oPropMain
  get _objectType () {
    throw new Error(`Need implements ${this._logName} > _objectType`)
  }
  constructor (cfg) {
    super(cfg)
  }
  get _oObjRaw () {
    const me = this
    return me.#oObj
  }
  get _oObjSafe () {
    const me = this
    if (!me.#oObj) me.#oObj = { type: me._objectType }
    return me.#oObj
  }
  get _oPropMainRaw () {
    const me = this
    return me.#oPropMain
  }
  get _oPropMainSafe () {
    const me = this
    if (!me.#oPropMain) me.#oPropMain = {}
    return me.#oPropMain
  }
  get oObjRaw () {
    const me = this
    const type = me._objectType
    const oPropText = me._oPropMainRaw
    const hasVal = oPropText //Check more pro here
    if (hasVal) {
      const o = me._oObjSafe
      o[type] = oPropText
    }
    return me._oObjRaw
  }
  get oObjSafe () {
    const me = this
    const o = me.oObjRaw
    return o ?? me._oObjSafe
  }
}
