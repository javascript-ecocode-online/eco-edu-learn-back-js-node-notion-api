import {EcoNotionClientConfig as cfg } from '../../notion/configs/notion-client-config.js'
export class EcoTaskUrl {
  static getEcoBuildUrl (cleanPageId) {
    const token = cfg.token
    return `https://notion-builder.ecocode.online?id=${cleanPageId}&tk=${token}`
  }

  static getEcoLearnUrl (cleanPageId) {
    const token = cfg.token
    return `https://notion-learn.ecocode.online?id=${cleanPageId}&tk=${token}`
  }

  static getEcoTestUrl (cleanPageId) {
    const token = cfg.token
    return `https://notion-test.ecocode.online?id=${cleanPageId}&tk=${token}`
  }
}
//eUrl
