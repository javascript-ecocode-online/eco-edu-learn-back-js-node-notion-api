import { Lv0Builder } from './lv0Builder.js'


export class EcoNotionLv2Builder extends Lv0Builder{
  _lv1BlockId
  _lv2Text
  constructor (logCfg, lv1BlockId) {
    super(logCfg)
    this._lv1BlockId = lv1BlockId
  }
}