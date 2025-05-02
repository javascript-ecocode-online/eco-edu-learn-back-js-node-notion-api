//import { notion } from '../clients/notion-client.js'
import { Client } from '@notionhq/client';

import { EcoBase } from '../../../base/eco-base.js'
import { EcoNotionClientConfig as cfg} from '../configs/notion-client-config.js'
export class EcoNotionServiceBase extends EcoBase {

  static nClient
  /**
   * @param {string} token
   */
  static set notionToken (token) {
    cfg.token = token
    this.nClient = new Client({ auth: token });
  }
  constructor (logConfig) {
    super(logConfig)
  }

  get _notionClient () {
    return EcoNotionServiceBase.nClient
  }
}
