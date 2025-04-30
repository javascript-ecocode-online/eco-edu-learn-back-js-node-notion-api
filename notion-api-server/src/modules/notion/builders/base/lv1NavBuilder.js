import { EcoNotionBuilderLv1Master } from './builder-lv1-master.js'
import { EcoNotionBlocksConfig as cfg} from '../../configs/notion-blocks-config.js'
export class Lv1NavBuilder extends EcoNotionBuilderLv1Master {
  get _linksDivider () {
    return cfg.linksDivider
  }
  constructor (name, pageId, buildCfg) {
    super(name, pageId, buildCfg)
  }

}
