import { Lv0Builder } from './lv0Builder.js'

import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'
import { EcoNotionServiceBuildBlockPage } from '../../services/notion-service-build-block-page.js'
// Lớp này có nhiêhm vụ tạo block lv1 
export class EcoNotionBuilderLv1Creator extends Lv0Builder {
    _pageId
    _textBuilder
  constructor (logCfg) {
    super(logCfg)
  }
  setPageId (pageId) {
    this._pageId = pageId
    return this
  }
  //Type of EcoNotionBuilderLv1DataText
  setTextBuilder(textBuilder){
    const me = this
    me._textBuilder = textBuilder
    return me
  }
  #getLv1ToggleBlockJson () {
    const me = this
    const textBuilder = me._textBuilder
    const richTextArr = textBuilder.getRichTextData()
    const blockBuilder = new EcoNotionBuilderBlockToggle()
    return blockBuilder.setRichTextArray(richTextArr).oBlockRaw
  }
  async _createLv1ToggleBlock () {
    const me = this
    const pageId = me._pageId
    const navMasterBlock1 = me.#getLv1ToggleBlockJson()
    if (!navMasterBlock1) return null
    const svc = new EcoNotionServiceBuildBlockPage()
    return await svc.appendChild(pageId, navMasterBlock1)
    //
  }
}
