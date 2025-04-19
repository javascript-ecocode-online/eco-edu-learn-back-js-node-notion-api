import { NotionQueryChildren } from '../notion/notion-query-children.js'

export class Lv0Builder {
  _name
  get _nqc () {
    return NotionQueryChildren.instance
  }
  constructor (name) {
    this._name = name
    console.log(`> Builder ${name} created!`)
  }
}
