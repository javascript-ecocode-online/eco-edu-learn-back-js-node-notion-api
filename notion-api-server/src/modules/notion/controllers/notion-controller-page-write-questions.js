import { EcoNotionRouterController } from './router-notion-controller.js'
import { EcoNotionServiceQueryWriteQuestions as Svc } from '../services/notion-service-query-questions-write.js'

export class EcoNotionControllerPageWriteQuestions extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)

    this.#init()
  }

  #init () {
    this._svc = new Svc()

    return this
  }

  // async test(req, res){
  //   res.json([])
  // }

  async getPageWriteQuestions (req, res) {
    const me = this

   await me._execRequestPageId('⚡️ get_page_write_questions', req, res, async pageId => {
      const svc = me._svc
      const blocks = await svc.getPageWriteQuestion(
        'api-get-page-write-questions',
        pageId
      )
      res.json(blocks)
    })
  }
}
