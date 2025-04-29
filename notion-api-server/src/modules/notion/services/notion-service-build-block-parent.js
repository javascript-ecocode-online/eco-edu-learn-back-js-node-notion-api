import { EcoNotionServiceBuildBlockBase as Base } from './notion-service-build-block-base.js'

export class EcoNotionServiceBuildBlockParent extends Base {
    constructor () {
        super({
          name: 'EcoNotionServiceBuildBlockToggle',
          isDebug: false,
          level: 'info',
        })
      }
      async appendChild (parentId, child) {
        const me = this
        return await me._appendChild(parentId, child)
       
      }
}