import { Lv2Builder } from '../../lv2Builder.js'
import {NotionJsonBuilder} from '../../../../utils/builders/notion-json-builder.js'

export class Nav1Lv2Builder extends Lv2Builder {
    _lv2Text = ''
  constructor (pageId, lv1BlockId, parents, friends, children) {
    super('Nav1Lv2Builder', lv1BlockId)
    this._pageId = pageId
    this._parents = parents
    this._friends = friends
    this._children = children
  }

  getBlocks(){
    const me = this
    const pageId = me._pageId
    const parents = me._parents
    const friends = me._friends
    const children = me._children
    //Working: 
    const nav1Lv2Blocks = me.#buildNavBlocks({ pageId, parents, friends, children })
    return nav1Lv2Blocks;
  }

  #createToggleBlock (richTextOrString, children = []) {
    //const me = this
    const jb = NotionJsonBuilder
    const rich_text = Array.isArray(richTextOrString)
      ? richTextOrString
      : jb.buildRichText(richTextOrString)
  
    return {
      object: 'block',
      type: 'toggle',
      toggle: {
        rich_text,
        children,
      },
    }
  }
#getStringOnlyPageId (pageId) {
    return pageId.replace(/-/g, '').trim()
  }
 #buildNavBlocks ({ pageId, parents, friends, children }) {
   
    //item.id
    const me = this
    const formatItem = item => {
      //console.log(`${pageId} vs ${item.id}`)
      return {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'mention',
              mention: {
                type: 'page',
                page: {
                  id: item.id, // phải là dạng UUID đầy đủ
                },
              },
            },
            {
              type: 'text',
              text: {
                content:
                me.#getStringOnlyPageId(pageId) == me.#getStringOnlyPageId(item.id)
                    ? ' ✨'
                    : ' 🔗',
              },
            },
          ],
        },
      }
  
    }
  
    const createToggleFolder = (label, items) => {
      const text = `${label} (${items.length.toString().padStart(2, '0')})`
      const children = items.map(formatItem)
      return me.#createToggleBlock(text, children)
      //return children
    }
    const rs = []
    if (parents?.length) rs.push(createToggleFolder('📂 Parent Pages', parents))
    if (friends?.length) rs.push(createToggleFolder('❄️ Friend Pages', friends))
    if (children?.length)
      rs.push(createToggleFolder('👶 Children Pages', children))
   
    //  console.log(rs)
    return rs
  }
}


      // return {
      //   object: 'block',
      //   type: 'paragraph',
      //   paragraph: {
      //     rich_text: [
      //       {
      //         type: 'mention',
      //         mention: {
      //           type: 'page',
      //           page: {
      //             id: item.id, // phải là dạng UUID đầy đủ
      //           },
      //         },
      //       },
      //       {
      //         type: 'text',
      //         text: {
      //           content:
      //             getStringOnlyPageId(pageId) == getStringOnlyPageId(item.id)
      //               ? ' ✨'
      //               : ' 🔗',
      //         },
      //       },
      //     ],
      //   },
      // }