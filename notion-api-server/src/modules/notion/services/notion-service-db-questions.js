import { EcoNotionServiceDbBase as Base } from './notion-service-db-base.js'
export class EcoNotionServiceDbQuestions extends Base {
  get #writeQuestions(){
    return 'Write Questions'
  }
  constructor () {
    super({
      name: 'EcoNotionServiceDbQuestions',
      isDebug: false,
      level: 'info',
    })
  }

  async getWriteDb (reason, pageId) {
    const me = this
    const dbName = me.#writeQuestions
    const dbArr = await me._getDbArrFromName(reason, pageId, dbName)
    //const dbos = me._getDbInfo(dbArr)
    const dbo = dbArr?.length ? dbArr[0]: null
    return dbo
  }

  async getWriteQuestions (reason, pageId) {
    const dbName = this.#writeQuestions
    return await this._getQuestions(reason, pageId, dbName)
  }

 
}
