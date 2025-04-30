import { EcoBase as Base } from '../../../../base/eco-base.js'
import { EcoNotionBuilderObjectText as TextBuilder } from './notion-builder-object-text.js'

export class EcoNotionBuilderRichTextLinks extends Base {
  constructor (
    logConfig = {
      isDebug: false,
      name: 'EcoNotionHelperRichTextLinks',
      level: 'info',
    }
  ) {
    super(logConfig)
  }

  #getBuilder (content) {
    return new TextBuilder().setContent(content)
  }

  #getSeperatorObj (devider) {
    devider = devider?.trim()
    return devider ? this.#getBuilder(` ${devider} `).oObjSafe : null
  }

  #getEmojiObj (emoji) {
    emoji = emoji?.trim()
    return emoji ? this.#getBuilder(`${emoji} `).oObjSafe : null
  }

  #getLinkObj (label, url) {
    label = label.trim()
    url = url?.trim()
    if (!label && url) label = url
    return label ? this.#getBuilder(label).setLink(url).oObjSafe : null
  }

  #processItem (richText, item, index, divider) {
    const me = this
    const emoji = item.emoji?.trim()
    const label = item.label
    const url = item.url

    if (index > 0) {
      const oDivider = me.#getSeperatorObj(divider)
      if (oDivider) richText.push(oDivider)
    }

    if (emoji) {
      const oEmoji = me.#getEmojiObj(emoji)
      if (oEmoji) richText.push(oEmoji)
    }

    if (label || url) {
      const oLink = me.#getLinkObj(label, url)
      if (oLink) richText.push(oLink)
    }
  }

  getLinksRichText (items, divider = '|') {
    const me = this
    const richText = []
    items?.forEach((item, index) => {
      me.#processItem(richText, item, index, divider)
    })
    return richText
  }
}
