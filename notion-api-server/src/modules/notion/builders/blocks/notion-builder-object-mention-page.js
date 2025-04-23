import { EcoNotionBuilderObjectMentionBase } from './notion-builder-object-mention-base.js'

export class EcoNotionBuilderObjectMentionPage extends EcoNotionBuilderObjectMentionBase {
  get _mentionType () {
    return 'page'
  }
  constructor () {
    super({
      name: 'EcoNotionBuilderObjectMentionPage',
      isDebug: false,
      level: 'info',
    })
  }
  setPageId (id) {
    const me = this
    const oPropMain = me._oPropMainSafe
    oPropMain[me._mentionType] = { id: id }
    return me
  }
}
