import { EcoNotionServiceQueryChildren } from '../../modules/notion/services/notion-service-query-children.js'

export class Lv0Builder {
  _name
  get _nqc () {
    return EcoNotionServiceQueryChildren.instance
  }
  constructor (name) {
    this._name = name
    console.log(`> Builder ${name} created!`)
  }
}
