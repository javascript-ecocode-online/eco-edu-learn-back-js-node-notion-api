import { EcoBase as Base } from '../../../../base/eco-base.js'
import fs from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3'

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
    const me = this

    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(me._folder)) {
      fs.mkdirSync(me._folder, { recursive: true })
    }

    // Tạo đường dẫn file db
    const dbPath = path.join(me._folder, me._dbName)

    // Kết nối tới SQLite (tạo file nếu chưa có)
    const db = new sqlite3.Database(dbPath)

    console.log(`Db created: ${dbPath}`)


    // Đóng kết nối ngay (chỉ tạo file)
    db.close()

    // Trả về đường dẫn file db
    return { dbPath }
  }
}