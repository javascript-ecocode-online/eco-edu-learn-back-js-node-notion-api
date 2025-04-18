import { Lv1Builder } from '../../lv1Builder.js'
import { Nav1Lv2Builder } from './nav1Lv2.js'
import { Nav1Lv4Builder } from './nav1Lv4.js'
import { notion } from '../../../../config/notionClient.js'

export class Nav1Lv1Builder extends Lv1Builder {
  _parentId
  _lv1Text = '☝ _Parent_ | ✍️ _Build_ | 👉 _Learn_'
  constructor (pageId, parents, friends, children) {
    super(pageId)
    this._parents = parents
    this._friends = friends
    this._children = children
    this._parentId = parents?.[0]?.id ?? ''
  }

  #buildNotionUrl (pageId) {
    const cleanId = pageId.replace(/-/g, '')
    return `https://www.notion.so/${cleanId}`
  }
  #buildRichTextWithLinks (items) {
    const richText = []

    items.forEach((item, index) => {
      if (index > 0) {
        // Thêm divider nếu không phải phần đầu tiên
        richText.push({
          type: 'text',
          text: { content: ' | ' },
        })
      }

      // Thêm emoji nếu có
      if (item.emoji) {
        richText.push({
          type: 'text',
          text: { content: `${item.emoji} ` },
        })
      }

      // Thêm link text
      richText.push({
        type: 'text',
        text: {
          content: item.label,
          link: { url: item.url },
        },
        //annotations: { italic: true },
      })
    })

    return richText
  }
  #createToggleBlock (richTextOrString) {
    const rich_text = Array.isArray(richTextOrString)
      ? richTextOrString
      : buildRichText(richTextOrString)

    return {
      object: 'block',
      type: 'toggle',
      toggle: {
        rich_text,
        //children,
      },
    }
  }
  _getLv1ToggleBlockJson () {
    const me = this
    const parentId = me._parentId

    const items = [
      { emoji: '☝', label: '_Parent_', url: me.#buildNotionUrl(parentId) },
      { emoji: '✍️', label: '_Build_', url: 'https://example.com/build' },
      { emoji: '👉', label: '_Learn_', url: 'https://example.com/learn' },
    ]

    const richText = me.#buildRichTextWithLinks(items)
    return me.#createToggleBlock(richText)
  }

  _getLv2Blocks (lv1BlockId) {
    const me = this
    const pageId = me._pageId
    const parents = me._parents
    const friends = me._friends
    const children = me._children
    const lv2Builder = new Nav1Lv2Builder(
      pageId,
      lv1BlockId,
      parents,
      friends,
      children
    )
    const nav1Lv2Blocks = lv2Builder.getBlocks()
    return nav1Lv2Blocks
  }

  async #getChildrenToggleBlocks(blockId) {
    const response = await notion.blocks.children.list({ block_id: blockId });
    return response.results
      .filter(block => block.type === 'toggle')
  }

  async _onExecuteDone (blockId) {
    console.log('_onExecuteDone', blockId)
    const me = this;
    const builder = new Nav1Lv4Builder()
    const lv2Blocks = await me.#getChildrenToggleBlocks(blockId)
    for (const lv2Block of lv2Blocks ?? []) {
      const lv3Blocks = await me.#getChildrenToggleBlocks(lv2Block.id)
      for (const lv3Block of lv3Blocks ?? []) {
        builder.init(lv3Block).execute()
        console.log('--- lv3Block', lv3Block)
      }
    }
   
    //console.log('Level 1 block id: ', blockId)
  }
}
