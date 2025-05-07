import { EcoNotionRouterController } from './router-notion-controller.js'
import { EcoNotionServiceQueryQuestionWrite } from '../services/notion-service-query-question-write.js'

export class EcoNotionControllerQuestionsWrite extends EcoNotionRouterController {
  constructor (cfg) {
    super(cfg)
    this.#init()
  }
  #init () {
    this._nqc = EcoNotionServiceQueryQuestionWrite.instance
    return this
  }

  // 🇻🇳 Lấy danh sách các trang con của trang
  // 🇳🇿 Get a list of sub-pages of the page
  async getDbId (req, res) {
    const me = this
    me._execRequestPageId('⚡️ get_db_question_write', req, res, async pageId => {
      const nqc = me._nqc
      const children = await nqc.getWriteQuestions('api-get-question-write', pageId)
      res.json(children)
    })
  }
}
