import { EcoNotionRouterController } from '../../../base/controller/router-notion-controller.js'
import { NotionQueryChildren } from '../services/notion-query-children.js'

export class EcoPageChildrenController extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }
  #init () {
    this._nqc = NotionQueryChildren.instance
    return this
  }

  // 🇻🇳 Lấy danh sách các trang con của trang
  // 🇳🇿 Get a list of sub-pages of the page
  async getChildren (req, res) {
    const me = this
    me._execRequestPageId('⚡️ get_page_children', req, res, async pageId => {
      const nqc = me._nqc
      const children = await nqc.getChildrenPages('api-get-children', pageId)
      res.json(children)
    })
  }
}
