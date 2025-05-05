import { EcoNotionRouterController } from './router-notion-controller.js'
import { EcoNotionServiceBuildPage } from '../services/notion-service-build-page.js'

export class EcoNotionControllerBuildPage extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }
  #init () {
    this._nbp = EcoNotionServiceBuildPage.instance
    return this
  }

  // 🇻🇳 Lấy danh sách các trang con của trang
  // 🇳🇿 Get a list of sub-pages of the page
  async buildPage (req, res) {
    const me = this
    const options = req.body.options
   
    me._execPostPageId('⚡️ build_page', req, res, async pageId => {
      const nbp = me._nbp
      const rs = await nbp.buildPage('api-build-page', pageId, options)
      res.json(rs)
    })
  }
}
