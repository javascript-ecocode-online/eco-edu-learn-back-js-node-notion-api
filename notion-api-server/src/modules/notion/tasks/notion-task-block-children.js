import { EcoNotionServiceQueryChildren as qs } from '../services/notion-service-query-children.js'

export class EcoNotionTaskBlockChildren {
  static _getRequestBlocksReason (name, level) {
    return `${name} > get level ${level} blocks`
  }

  static async processBlocksFromParent (name, level, parentBlockId, type, asyncFunc) {
    const me = this
    const nqc = qs.instance
    const reason = me._getRequestBlocksReason(name, level)
    const children = await nqc.getAllChildrenById(reason, parentBlockId, type)
    for (const child of children ?? []) await asyncFunc(child)
    //await Promise.all((children ?? []).map(child => asyncFunc(child)));
  }

  static async processLv2BlocksFromLv1 (name, lv1BlockId, type, func) {
    const me = this
    await me.processBlocksFromParent(name, 2, lv1BlockId, type, func)
  }

  static async processLv3BlocksFromLv1 (name, lv1BlockId, lv2Type, lv3Type, asyncFunc) {
    const me = this
    await me.processLv2BlocksFromLv1(name, lv1BlockId, lv2Type, async lv2Block => {
      await me.processBlocksFromParent(name, 3, lv2Block.id, lv3Type, asyncFunc)
    })
  }

  static async processLv4BlocksFromLv1 (name, lv1BlockId, lv2Type, lv3Type, lv4Type, asyncFunc) {
    const me = this
    await me.processLv2BlocksFromLv1(name, lv1BlockId, lv2Type, async lv2Block => {
      await me.processLv3BlocksFromLv1(name, lv2Block.id, lv3Type, async lv3Block => {
        await me.processBlocksFromParent(name, 3, lv3Block.id, lv4Type, asyncFunc)
      })
    })
  }
}
