import { EcoNotionRouterController } from './router-notion-controller.js'
import { EcoNotionServiceQueryQuestions } from '../services/notion-service-query-questions.js'

export class EcoNotionControllerPageQuestions extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)

    this.#init()
  }

  #init () {
    this._svc = new EcoNotionServiceQueryQuestions()

    return this
  }

  // async test(req, res){
  //   res.json([])
  // }

  async getPageQuestions (req, res) {
    const me = this

    me._execRequestPageId('⚡️ get_page_questions', req, res, async pageId => {
      const svc = me._svc
      const blocks = await svc.getPageWriteQuestion(
        'api-get-page-questions',
        pageId,
        'w'
      )
      res.json(blocks)
    })
  }
}
