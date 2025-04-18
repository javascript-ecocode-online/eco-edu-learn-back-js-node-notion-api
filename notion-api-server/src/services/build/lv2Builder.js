import { notion } from '../../config/notionClient.js'

import { EcoTextUtil as ETU } from '../../utils/text.js'

export class Lv2Builder {
  _lv1BlockId
  _lv2Text
  constructor (lv1BlockId) {
    this._lv1BlockId = lv1BlockId
  }
}