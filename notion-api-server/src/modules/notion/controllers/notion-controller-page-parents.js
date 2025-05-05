import { EcoNotionRouterController } from './router-notion-controller.js'
import { EcoNotionServiceQueryParents } from '../services/notion-service-query-parents.js'

export class EcoNotionControllerPageParents extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }

  #init () {
    this._nqp = EcoNotionServiceQueryParents.instance
    return this
  }

  // 🇻🇳 Lấy danh sách các trang cha của trang
  // 🇳🇿 Get a list of parent-pages of the page
  async getParents (req, res) {
    const me = this
    me._execRequestPageId('⚡️ get_page_parents', req, res, async pageId => {
      const nqp = me._nqp
      const parents = await nqp.getAllParentPages('api-get-parents', pageId)
      res.json(parents)
    })
  }
}
