import { EcoNotionBuilderObjectBase } from './notion-builder-object-base.js'
export class EcoNotionBuilderObjectText extends EcoNotionBuilderObjectBase {
  get _objectType () {
    return 'text'
  }
  
  constructor () {
    super({ name: 'EcoNotionBuilderObjectText', isDebug: false, level: 'info' })
  }

  setContent (content) {
    const me = this
    const oPropMain = me._oPropMainSafe
    oPropMain['content'] = content
    return me
  }
  setLink (url) {
    const me = this
    const oPropMain = me._oPropMainSafe
    oPropMain['link'] = { url: url }
    return me
  }
}
