import { EcoNotionRouterController } from '../../../base/controller/router-notion-controller.js'
import { NotionQueryRelations } from '../services/notion-query-relations.js'

export class EcoPageRelationsController extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }
  #init () {
    this._nqr = NotionQueryRelations.instance
    return this
  }

  // 🇻🇳 Lấy danh sách các trang con của trang
  // 🇳🇿 Get a list of sub-pages of the page
  async getRelations (req, res) {
    const me = this
    me._execRequestPageId('⚡️ get_page_relations', req, res, async pageId => {
      const nqr = me._nqr
      const relations = await nqr.getRelations('api-get-relations', pageId)
      res.json(relations)
    })
  }
}
