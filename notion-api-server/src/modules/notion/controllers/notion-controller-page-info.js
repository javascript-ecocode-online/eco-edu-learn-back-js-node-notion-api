import { EcoNotionRouterController } from './router-notion-controller.js'
import { EcoNotionServiceQueryPage } from '../services/notion-service-query-page.js'

export class EcoNotionControllerPageInfo extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }
  #init () {
    this._nqs = EcoNotionServiceQueryPage.instance
    return this
  }

  // 🇻🇳 Lấy danh sách các trang con của trang
  // 🇳🇿 Get a list of sub-pages of the page
  async getPageInfo (req, res) {
    const me = this
    me._execRequestPageId('⚡️ get_page_info', req, res, async pageId => {
      const nqs = me._nqs
      const info = await nqs.getPageInfo('api-get-info', pageId)
      res.json(info)
    })
  }
}
