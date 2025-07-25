import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { EcoBase as Base } from '../../../../base/eco-base.js'

export class DcSQLiteBdr extends Base {
  constructor (folder, dbName, pageId, pageBlocks, pageInfo) {
    super('DcSQLiteBdr', pageId)
    this._folder = folder
    this._dbName = dbName
    this._pageId = pageId
    this._pageBlocks = pageBlocks
    this._pageInfo = pageInfo
  }

  async execute () {
    if (!fs.existsSync(this._folder)) {
      fs.mkdirSync(this._folder, { recursive: true })
    }
    const dbPath = path.join(this._folder, this._dbName)
    const SQL = await initSqlJs()
    const db = new SQL.Database()
    const data = db.export()
    fs.writeFileSync(dbPath, Buffer.from(data))
    db.close()
    console.log(`Db created: ${dbPath}`)
    return { dbPath }
  }
}