import { EcoNotionRouterController } from './router-notion-controller.js'
import { EcoNotionServiceDbQuestions } from '../services/notion-service-db-questions.js'

export class EcoNotionControllerQuestionsDbs extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }
  #init () {
    this._nqc = EcoNotionServiceDbQuestions.instance
    return this
  }

  // 🇻🇳 Lấy danh sách các trang con của trang
  // 🇳🇿 Get a list of sub-pages of the page
  async getDbId (req, res) {
    const me = this
    me._execRequestPageId('⚡️ get_db_question_dbs', req, res, async pageId => {
      const nqc = me._nqc
      const children = await nqc.getWriteDb('api-get-question-dbs', pageId)
      res.json(children)
    })
  }
}
