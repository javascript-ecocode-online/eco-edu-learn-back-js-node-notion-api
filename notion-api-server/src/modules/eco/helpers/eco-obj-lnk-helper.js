import { EcoUrlHelper as eUrl } from './eco-txt-url-helper.js'
export class EcoObjLinkHelper {
  static getRelatedLearnLinkObject (id) {
    return {
      emoji: '⛵️ ',
      content: '_Learn_',
      url: eUrl.getEcoLearnUrl(id),
    }
  }
  static getRelatedTestLinkObject (id) {
    return {
      emoji: '🌳 ',
      content: '_Test_',
      url: eUrl.getEcoTestUrl(id),
    }
  }
}
