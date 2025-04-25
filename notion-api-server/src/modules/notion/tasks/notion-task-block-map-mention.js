import { EcoNotionTaskBlockMapCore as core } from './notion-task-block-map-core.js'
import { EcoNotionTaskBlockCheck as checker } from './notion-task-block-check.js'
export class EcoNotionTaskBlockMapMention {
  static _mentionKey = 'mention'
  static _mentionPageKey = 'page'
  static _mentionTypes = ['page', 'database', 'user']

  static _extractMentionTargetIdFromItem (item) {
    const me = this
    if (!item || item.type !== me._mentionKey) return null
    const m = item.mention
    if (me._mentionTypes.includes(m?.type)) {
      return m[m.type]?.id
    }
    return null
  }

  static _extractFirstMentionTargetIdFromBlock (block, type) {
    const me = this
    const richTextItems = core.getRichTextFromBlock(block)
    if (!Array.isArray(richTextItems)) return null

    const foundItem = richTextItems.find(item =>
      checker.isMentionType(item, type)
    )
    return foundItem ? me._extractMentionTargetIdFromItem(foundItem) : null
  }

  static extractFirstPageIdFromBlock (block) {
    const mentionType = this._mentionPageKey
    return this._extractFirstMentionTargetIdFromBlock(block, mentionType)
  }
}
