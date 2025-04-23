import { EcoUrlHelper as eUrl } from './eco-txt-url-helper.js'
export class EcoObjLinkHelper {
  static getRelatedLearnLinkObject (id) {
    return {
      emoji: '⛵️ ',
      label: '_Learn_',
      url: eUrl.getEcoLearnUrl(id),
    }
  }
  static getRelatedTestLinkObject (id) {
    return {
      emoji: '🌳 ',
      label: '_Test_',
      url: eUrl.getEcoTestUrl(id),
    }
  }
  static getRawInputCompareText (arrObjects) {
    return arrObjects
      ?.map(o => {
        const emoji = o.emoji?.trim()
        const label = o.label
        return `${emoji} ${label}`
      })
      .join(' ')
  }
}
