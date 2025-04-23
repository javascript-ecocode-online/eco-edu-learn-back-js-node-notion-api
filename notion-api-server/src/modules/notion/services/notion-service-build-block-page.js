import { EcoNotionServiceBuildBlockBase as Base } from './notion-service-build-block-base.js'

export class EcoNotionServiceBuildBlockPage extends Base {
  constructor () {
    super({
      name: 'EcoNotionServiceBuildBlockPage',
      isDebug: false,
      level: 'info',
    })
  }

  async appendChild (pageId, child) {
    const me = this
    return await me._appendChild(pageId, child)
   
  }
}
