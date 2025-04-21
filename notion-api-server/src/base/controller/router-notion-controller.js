import { EcoRouterController } from './router-controller.js'

export class EcoNotionRouterController extends EcoRouterController {
  constructor (cfg) {
    super(cfg)
  }
  async _execRequestPageId (name, req, res, func) {
    const me = this
    const {pageId} = req.params
    me._execRequest(name, res, async () => {
      const pid = me.#validateRequestPageId(pageId, res)
      if (!pid) return
      await func(pid)
    })
  }
  async _execPostPageId (name, req, res, func) {
    const me = this
    const pid = req.body.pageId
    me._execRequest(name, res, async () => {
      const pageId = me.#validateRequestPageId(pid, res)
      if (!pageId) return
      await func(pageId)
    })
  }
  // 🔒 Private methods
  #validateRequestPageId (pageId, res) {
    const me = this
    if (!me.#isPresent(pageId)) {
      res
        .status(400)
        .json({ error: `Missing required query parameter: pageId: ${pageId}` })
      return null
    }
    if (!me.#isValidFormat(pageId)) {
      res.status(400).json({ error: 'Invalid pageId format' })
      return null
    }
    return pageId
  }
  #isValidFormat (id) {
    // Notion thường dùng UUID hoặc chuỗi 32 kí tự không có dấu
    const uuidRegex =
      /^[0-9a-fA-F]{32}$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
    return uuidRegex.test(id)
  }
  #isPresent (id) {
    return id && typeof id === 'string' && id.trim().length > 0
  }
}
