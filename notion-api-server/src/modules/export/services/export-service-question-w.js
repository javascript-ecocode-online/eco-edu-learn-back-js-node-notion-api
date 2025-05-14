import { ExportBaseService } from './export-service-base.js'
export class ExportWQuestionsService extends ExportBaseService {
  constructor (logConfig) {
    super(logConfig)
  }
  async saveWQuestions (data) {
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
        "sSc": d.sSc,
        "qVn": d.qVn,
        "aCt": d.aCt 
      }
      arr.push(obj)
    })
    return arr
  }
}
