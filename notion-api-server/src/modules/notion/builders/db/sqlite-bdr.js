import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { EcoBase as Base } from '../../../../base/eco-base.js'

export class DcSQLiteBdr extends Base {
  constructor(dbc, pageId, pageBlocks, pageInfo) {
    super('DcSQLiteBdr', pageId)
    this._dbi = dbc.dbi
    this._dbf = dbc.dbf
    this._dbn = dbc.dbn
    this._pageId = pageId
    this._pageBlocks = pageBlocks
    this._pageInfo = pageInfo
  }

  async execute() {
    if (!this._dbi) return;
    if (!this._dbn) return;
    if (!this._dbf) return;
    const fldPth = path.join(this._dbf, this._dbn)
    if (!fs.existsSync(fldPth)) {
      fs.mkdirSync(fldPth, { recursive: true })
    }
    const dbPath = path.join(fldPth, this._dbi)
    const SQL = await initSqlJs()
    const db = new SQL.Database()
    const data = db.export()
    fs.writeFileSync(dbPath, Buffer.from(data))
    db.close()
    console.log(`Db created: ${dbPath}`)
    return { dbPath }
  }
}