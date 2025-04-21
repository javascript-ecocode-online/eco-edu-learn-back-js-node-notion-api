import { EcoNotionRouterController } from '../../../base/controller/router-notion-controller.js'
import { EcoNotionServiceQueryChildren } from '../services/notion-service-query-children.js'

export class EcoNotionControllerPageBlocks extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }

  #init () {
    this._nqc = EcoNotionServiceQueryChildren.instance
    return this
  }

  async getPageBlocks (req, res) {
    const me = this
    me._execRequestPageId('⚡️ get_page_blocks', req, res, async pageId => {
      const nqc = me._nqc
      const blocks = await nqc.getPageBlocks('api-get-blocks', pageId)
      res.json(blocks)
    })
  }
}
