import { EcoNotionRouterController } from '../../notion/controllers/router-notion-controller.js'
import { EcoNotionServiceQueryWriteQuestions as Svc } from '../../notion/services/notion-service-query-questions-write.js'
import { ExportWQuestionsService as ExportSvc } from '../services/export-service-question-w.js'
export class ExportWQuestionsController extends EcoNotionRouterController {
  _exportSvc
  constructor (cfg) {
    super(cfg)
    this.#init()
  }
  #init () {
    this._svc = new Svc()
    this._exportSvc = new ExportSvc()
    return this
  }

  async exportWQuestions (req, res) {
    const me = this
    await me._execRequestPageId(
      '⚡️ get_page_write_questions',
      req,
      res,
      async pageId => {
        const notionSvc = me._svc
        const exportSvc = me._exportSvc
        const blocks = await notionSvc.getPageWriteQuestion(
          'api-get-page-write-questions',
          pageId
        )
        const saveRs = await exportSvc.saveWQuestions(blocks)
        res.json(saveRs)
      }
    )
  }
}
