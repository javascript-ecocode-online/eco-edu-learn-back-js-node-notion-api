import { EcoBase as Base } from '../../../base/eco-base.js'
import { EcoTasksLinks as eObjLnk } from '../tasks/notion-task-block-links.js'
import { EcoNotionTaskBlockCheck as pChecker } from '../tasks/notion-task-block-check.js'

export class EcoNotionMissionBlockCompare extends Base {
  constructor (
    logConfig = {
      isDebug: false,
      name: 'EcoNotionMissionBlockCompare',
      level: 'info',
    }
  ) {
    super(logConfig)
  }
  #getCompareText (text, separator) {
    if (separator) {
      const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape nếu là ký tự đặc biệt trong regex
      const regex = new RegExp(escapedSeparator, 'g')
      text = text?.replace(regex, '') // Loại bỏ separator được truyền vào
    }
    return text.replace(/\s+/g, '') // Loại bỏ khoảng trắng
  }
  #getBlockCompareText (block, separator) {
    const me = this
    const rawBlockText = block?.paragraph?.rich_text
      .map(rt => rt.plain_text)
      .join('')
      //console.log('🥖 rawBlockText: ', rawBlockText)
    return me.#getCompareText(rawBlockText, separator)
  }
  #isEqualInputText (block, inputCompareText, separator) {
    const me = this
    if (pChecker.hasParagraphContent(block)) {
      const blockCompareText = me.#getBlockCompareText(block, separator)
      if (blockCompareText === inputCompareText) return true
    }
    return false
  }
  isBlockFound (blocks, textLine, separator) {
    const me = this
    const inputCompareText = me.#getCompareText(textLine, separator)
    for (const block of blocks) {
      const isEqual = me.#isEqualInputText(block, inputCompareText, separator)
      if (isEqual) return true
    }
    return false
  }
}
