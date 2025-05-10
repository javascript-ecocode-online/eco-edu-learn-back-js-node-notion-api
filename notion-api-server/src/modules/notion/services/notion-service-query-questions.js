import { EcoNotionServiceQueryChildren as Base } from './notion-service-query-children.js'

export class EcoNotionServiceQueryQuestions extends Base {
  constructor () {
    super({
      name: 'EcoNotionServiceQueryQuestions',
      isDebug: false,
      level: 'info',
    })
  }

  #removeEmoji (prefix, txt) {
    return txt.replace(new RegExp(prefix?.trim(), 'g'), '')?.trim()
  }

  #getTextFromRichText (block) {
    if (!block) return ''
    const rs = block[block.type]?.rich_text
      .map(rt => rt.plain_text)
      .join('')
      ?.trim()
    return rs
  }

  async #processEnLv4 (obj, id3) {
    const me = this
    const reason = 'processEnLv4'
    //console.log('🌿 processEnLv4 for: ', id3)
    //const vnPrefix = ''
    const lv4Blocks = await me.getAllChildrenById(
      reason,
      id3,
      'bulleted_list_item'
    )
    let i = 0
    for (const lv4 of lv4Blocks) {
      const txt4 = me.#getTextFromRichText(lv4)
      if (txt4) {
        if (i === 0) {
          obj.translation = txt4
          i++
        } else if (i === 1) {
          obj.source = txt4
          i++
        }
      }
      //console.log(lv4[lv4.type].rich_text, txt4)
    }
  }
  async #processVnLv4 (obj, id3) {
    const me = this
    const reason = 'processVnLv4'
    //console.log('🌿 processVnLv4 for: ', id3)
    //const vnPrefix = ''
    const lv4Blocks = await me.getAllChildrenById(
      reason,
      id3,
      'bulleted_list_item'
    )
    let i = 0
    for (const lv4 of lv4Blocks) {
      const txt4 = me.#getTextFromRichText(lv4)
      if (txt4) {
        if (i === 0) {
          obj.translation = txt4
          i++
        } else if (i === 1) {
          obj.context = txt4
          i++
        }
      }
      //console.log(lv4[lv4.type].rich_text, txt4)
    }
  }
  async #processEnLv3 (obj, id2) {
    const me = this
    const enPrefix = '🪻'
    const reason = 'processEnLv3'
    const lv3Blocks = await me.getAllChildrenById(reason, id2, 'toggle')
    const arr = []
    for (const lv3 of lv3Blocks) {
      const id3 = me._cleanId(lv3.id)
      const txt3 = me.#getTextFromRichText(lv3)

      if (txt3.startsWith(enPrefix)) {
        const phrase = me.#removeEmoji(enPrefix, txt3)
        if (phrase) {
          const lv3Obj = {
            id3: id3,
            phrase: phrase,
          }

          if (lv3.has_children) {
            await me.#processEnLv4(lv3Obj, id3)
          }

          arr.push(lv3Obj)
        }
      }
    }
    if (arr?.length) obj.questions = arr
  }
  async #processVnLv3 (obj, id2) {
    const me = this
    const vnPrefix = '🥕'
    const reason = 'processVnLv3'
    const lv3Blocks = await me.getAllChildrenById(reason, id2, 'toggle')
    const arr = []
    for (const lv3 of lv3Blocks) {
      const id3 = me._cleanId(lv3.id)
      const txt3 = me.#getTextFromRichText(lv3)

      if (txt3.startsWith(vnPrefix)) {
        const phrase = me.#removeEmoji(vnPrefix, txt3)
        if (phrase) {
          const lv3Obj = {
            id3: id3,
            phrase: phrase,
          }

          if (lv3.has_children) {
            await me.#processVnLv4(lv3Obj, id3)
          }

          arr.push(lv3Obj)
        }
      }
    }
    if (arr?.length) obj.questions = arr
  }

  async #eachLv2 (arr, lv1) {
    const me = this
    const id1 = me._cleanId(lv1.id)
    const enPrefix = '🪔'
    const vnPrefix = '🇻🇳'
    //console.log(`----- 🛸 block: ----- ${id1}`)
    //arr.push(`----- 🛸 block: ----- ${id1}`)
    const reason = 'eachLv2'
    const lv2Blocks = await me.getAllChildrenById(reason, id1, 'toggle')
    const enArr = []
    const vnArr = []
    for (const lv2 of lv2Blocks) {
      const id2 = me._cleanId(lv2.id)
      const txt2 = me.#getTextFromRichText(lv2)
      //console.log(txt2)
      if (txt2.startsWith(enPrefix)) {
        // console.log(lv2[lv2.type]?.rich_text)
        const enObj = { id2: id2, sentence: me.#removeEmoji(enPrefix, txt2) }
        enArr.push(enObj)
        await me.#processEnLv3(enObj, id2)
      } else if (txt2.startsWith(vnPrefix)) {
        const vnObj = { id2: id2, sentence: me.#removeEmoji(vnPrefix, txt2) }
        await me.#processVnLv3(vnObj, id2)
        vnArr.push(vnObj)
      }
      //arr.push(rt.plain_text)
    }
    enArr.forEach((v, i) => {
      const obj = {}
      obj.id1 = id1
      obj.en = v
      obj.vn = vnArr[i]
      arr.push(obj)
    })
  }

  #canLearnWords (rt) {
    let rs = false
    const txt = rt.plain_text
    if (!txt?.trim()) return rs
    rs = rs || txt.includes('🛫')
    rs = rs || txt.includes('🪺')
    rs = rs || txt.includes('🌲')
    return rs
  }

  async getPageQuestion (reason, pageId) {
    const me = this
    const arr = []
    const blocks = await me.getPageBlocks(reason, pageId)
    // console.log(blocks)
    for (const b of blocks) {
      if (b.type === 'toggle') {
        let isTarget = b[b.type].rich_text.some(rt => me.#canLearnWords(rt))
        if (isTarget) {
          await me.#eachLv2(arr, b)

          //console.log(b.toggle.rich_text)
        }
      }
    }
    return arr
  }
}
