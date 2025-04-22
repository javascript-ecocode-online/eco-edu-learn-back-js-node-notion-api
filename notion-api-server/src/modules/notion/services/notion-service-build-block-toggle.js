import { EcoNotionServiceBuildBlockBase as Base } from './notion-service-build-block-base.js'

export class EcoNotionServiceBuildBlockToggle extends Base {
  constructor () {
    super({
      name: 'EcoNotionServiceBuildBlockToggle',
      isDebug: true,
      level: 'info',
    })
  }
  async appendChild (pageId, child) {
    const me = this
    return await me._appendChild(pageId, child)
   
  }
  async appendChildren (blockId, children) {
    const me = this
    return await me._appendChildren(blockId, children)
   
  }

  async updateRichText (blockId, richTextArr) {
    const me = this
    return await me._updateRichText('toggle', blockId, richTextArr)
  }

  
}
