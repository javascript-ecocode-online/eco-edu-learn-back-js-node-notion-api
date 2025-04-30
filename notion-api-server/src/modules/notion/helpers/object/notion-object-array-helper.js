import { NotionIdHelper as ids } from '../id/notion-id-helper.js'

export class NotionJsonArrayHelper {
  static getFirstBlockId (array) {
    const id = array?.[0]?.id ?? ''
    return id
  }

  static getBackPageId (pageId, friends, parents) {
    const me = this
    let isParent = false
    pageId = ids.cleanId(pageId)
    //console.log('💥 getBackBlockId: ', pageId)
    //console.log('💥 parents: ', parents)
    //console.log('💥 friends: ', friends)
    // Tìm vị trí của pageId trong danh sách bạn bè (friends)
    const index = friends.findIndex(f => ids.cleanId(f.id) === pageId)
    let rs = null
    if (index !== -1) {
      // Nếu tìm thấy và có phần tử trước đó
      if (index > 0) {
        rs = friends[index - 1].id
      } else {
        // Nếu không có phần tử trước đó, trả về id đầu tiên trong parents (nếu có)
        rs = me.getFirstBlockId(parents)
        isParent = true
        //rs = null
      }
    }
    if (rs) rs = ids.cleanId(rs)
    //console.log('💥 getBackBlockId rs: ', rs)

    // Nếu pageId không có trong friends
    return {id : rs, isParent: isParent}
  }

  static getNextPageId (pageId, friends, parents) {
    const me = this
    let rs = null
    let isParent = false
    pageId = ids.cleanId(pageId)
    const index = friends.findIndex(f => ids.cleanId(f.id) === pageId)
    if (index === -1 || index === friends.length - 1) {
      rs = me.getFirstBlockId(parents)
      isParent = true
    } else {
      rs = friends[index + 1]?.id || null
    }
    if (rs) rs = ids.cleanId(rs)
    //console.log('💥 getNextPageId rs: ', rs)
    return {id : rs, isParent: isParent}
  }

  static getFirstChildPageId (children) {
    const me = this
    let rs = me.getFirstBlockId(children)
    if (rs) rs = ids.cleanId(rs)
    //console.log('💥 getFirstChildPageId rs: ', rs)
    return rs
  }

  static getEndNavBlockId (pageBlocks, textComparer) {
    if (!pageBlocks.length) return null
    let foundBlock = pageBlocks?.find(
      block => block.type == 'toggle' && textComparer.isMatchContent(block)
    )
    if(!foundBlock) {
      foundBlock = pageBlocks[pageBlocks.length - 1]
    }
    const rs = foundBlock?.id

   //console.log('⭐️ getEndNavBlockId: ', rs)
    return rs
  }
}
