import { Lv0Builder } from './lv0Builder.js'


export class Lv2Builder extends Lv0Builder{
  _lv1BlockId
  _lv2Text
  constructor (name, lv1BlockId) {
    super(name)
    this._lv1BlockId = lv1BlockId
  }
}