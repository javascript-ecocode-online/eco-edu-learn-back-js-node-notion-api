import { EcoNotionBuilderLv1DataText as Base } from '../base/builder-lv1-data-text.js'
import { EcoNotionTemplateLv1 } from '../../templates/notion-template-lv1.js'

export class EcoNotionNav2Lv1EndItemsBuilder extends Base {
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionNav2Lv1EndItemsBuilder',
      level: 'info',
    }
  ) {
    super(logCfg)
  }

  getMenuItemData () {
    const tpl = EcoNotionTemplateLv1.nav3Template
    const items = [
      {
        emoji: tpl.back.emoji,
        label: tpl.back.label,
        url: undefined,
      },
      {
        emoji: tpl.top.emoji,
        label: tpl.top.label,
        url: undefined,
      },
      {
        emoji: tpl.child.emoji,
        label: tpl.child.label,
        url: undefined,
      },
      {
        emoji: tpl.next.emoji,
        label: tpl.next.label,
        url: undefined,
      },
    ]
    return items
  }
}
