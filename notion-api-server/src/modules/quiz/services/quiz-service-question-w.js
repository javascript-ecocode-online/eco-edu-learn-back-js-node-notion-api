import { QuizBaseService as Base } from './quiz-service-base.js'
import pool from '../db.js'
import { v4 as uuidv4 } from 'uuid'

export class QuizWQuestionsService extends Base {
  constructor (logConfig) {
    super(logConfig)
  }
 
  async saveWQuestions (data) {
    const me = this
    const arr = []
    let i = 0
    for (const d of data) {
      i++
      console.log(`🪔 saving ${i} ...`, d)
      //const id = uuidv4()
      const id = me._normalizeToUUID(d.id)
      //console.log('🔑 final id:', id)
      const { sql, values } = me._buildInsertOrUpdateSQL(
        'eco_notion_question',
        {
          id: id,
          qut: 'sa-' + d.type, //b: blank
          qen: d.qEn,
          qvn: d.qVn,
          sen: d.sEn,
          svn: d.sVn,
          aen: d.aEn,
          avn: d.aVn,
          act: d.aCt,
          //ach: 0,
          //sel: 0,
          idx: i
         
        },
        ['id']
      )
      const [r] = await pool.execute(sql, values)
      arr.push({
        insertId: r.insertId,
        affectedRows: r.affectedRows,
        serverStatus: r.serverStatus,
        fieldCount: r.fieldCount,
        info: r.info,
        warningStatus: r.warningStatus,
        changedRows: r.changedRows,
      })
    }

    return arr
  }
}
