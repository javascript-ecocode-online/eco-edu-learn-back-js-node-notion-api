import { EcoNotionRouterController } from './router-notion-controller.js'
import { EcoNotionServiceQuerySiblings } from '../services/notion-service-query-siblings.js'

export class EcoNotionControllerPageSiblings extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }
  #init () {
    this._nqs = EcoNotionServiceQuerySiblings.instance
    return this
  }

  // 🇻🇳 Lấy danh sách các trang con của trang
  // 🇳🇿 Get a list of sub-pages of the page
  async getSiblings (req, res) {
    const me = this
    me._execRequestPageId('⚡️ get_page_siblings', req, res, async pageId => {
      const nqs = me._nqs
      const siblings = await nqs.getSiblingPages('api-get-siblings', pageId)
      res.json(siblings)
    })
  }
}
