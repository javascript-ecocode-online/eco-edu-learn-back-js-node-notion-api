import { EcoNotionRouterController } from '../../../base/controller/router-notion-controller.js'
import { NotionQueryChildren } from '../services/notion-query-children.js'

export class EcoPageBlocksController extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }

  #init () {
    this._nqc = NotionQueryChildren.instance
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
