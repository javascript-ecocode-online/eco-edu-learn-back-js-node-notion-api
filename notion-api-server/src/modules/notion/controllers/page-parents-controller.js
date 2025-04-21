import { EcoNotionRouterController } from '../../../base/controller/router-notion-controller.js'
import { NotionQueryParents } from '../../../services/notion/notion-query-parents.js'

export class EcoPageParentsController extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }

  #init () {
    this._nqp = NotionQueryParents.instance
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
