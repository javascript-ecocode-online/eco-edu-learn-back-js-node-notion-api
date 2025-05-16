import { ExportBaseService } from './export-service-base.js'
import { QuizWQuestionsService } from '../../quiz/services/quiz-service-question-w.js'
export class ExportWQuestionsService extends ExportBaseService {
  constructor (logConfig) {
    super(logConfig)
    this.#init()
  }
  #init () {
      this._quizSvc = new QuizWQuestionsService()
      return this
    }
  async saveWQuestions (data) {
    const me = this
    const quizSvc = me._quizSvc
    const arr = []
    data?.forEach((d, i) => {
      const obj = {
        "id": d.id,
        "type": d.type,
        "sEn": d.sEn,
        "qEn": d.qEn,
        "sVn": d.sVn,
        "aEn": d.aEn,
        "aVn": d.aVn,
        "qVn": d.qVn,
        "aCt": d.aCt 
      }
      arr.push(obj)
    })
    const rs = await quizSvc.saveWQuestions(arr)
    return rs
  }
}
