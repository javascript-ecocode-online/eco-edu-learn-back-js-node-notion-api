import { EcoNotionServiceQueryChildren as Base } from './notion-service-query-children.js'

export class EcoNotionServiceQueryQuestions extends Base {
  constructor () {
    super({
      name: 'EcoNotionServiceQueryQuestions',
      isDebug: false,
      level: 'info',
    })
  }

  async #eachLv2 (arr, b) {
    const me = this
    const id = me._cleanId(b.id)
    arr.push(`----- 🛸 block: ----- ${id}`)
    const reason = 'getPageWriteQuestion'
    const lv2Blocks = await me.getAllChildrenById(reason, id, 'toggle')
    for (const b2 of lv2Blocks) {
      //console.log(`🪽 -- lv2 id: ${b2.id} --`)
      //arr.push(`🪽 -- lv2 id: ${b2.id} --`)
      //console.log(`🪽 B2 id: ${b2.id}`)

      for (const rt of b2[b2.type].rich_text) {
        arr.push(rt.plain_text)
        console.log(rt)
      }
    }
    arr.push('')
  }

  async getPageWriteQuestion (reason, pageId, type) {
    const me = this
    const arr = []
    const blocks = await me.getPageBlocks(reason, pageId)
    for (const b of blocks) {
      if (b.type === 'toggle') {
        let isTarget = b[b.type].rich_text.some(
          rt => rt.plain_text.includes('🛫') || rt.plain_text.includes('🪺')
        )
        if (isTarget) {
          await me.#eachLv2(arr, b)

          //console.log(b.toggle.rich_text)
        }
      }
    }
    return arr
  }
}
