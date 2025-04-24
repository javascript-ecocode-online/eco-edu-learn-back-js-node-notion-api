import { EcoTaskUrl as eUrl } from '../../eco/tasks/eco-task-url.js'
import { EcoConfigLinks as eLnk } from '../../eco/configs/eco-config-links.js'
export class EcoTasksLinks {
  static getRelatedLearnLinkObject (id) {
    const c = eLnk.learn
    return {
      emoji: c.emoji,
      label: c.label,
      url: eUrl.getEcoLearnUrl(id),
    }
  }
  static getRelatedTestLinkObject (id) {
    const c = eLnk.test
    return {
      emoji: c.emoji,
      label: c.label,
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
