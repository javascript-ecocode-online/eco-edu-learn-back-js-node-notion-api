import { EcoNotionBuilderLv1DataText as Base } from '../base/level/builder-lv1-data-text.js'
import { EcoNotionTemplateLv1 } from '../../templates/notion-template-lv1.js'

export class EcoNotionTopItemsBuilder extends Base {
  constructor (
    logCfg = {
      isDebug: false,
      name: 'EcoNotionTopItemsBuilder',
      level: 'info',
    }
  ) {
    super(logCfg)
  }

  getMenuItemData () {
    const tpl = EcoNotionTemplateLv1.nav2Template
    const items = [
      {
        emoji: tpl.back.emoji,
        label: tpl.back.label,
        url: undefined,
      },
      {
        emoji: tpl.end.emoji,
        label: tpl.end.label,
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
