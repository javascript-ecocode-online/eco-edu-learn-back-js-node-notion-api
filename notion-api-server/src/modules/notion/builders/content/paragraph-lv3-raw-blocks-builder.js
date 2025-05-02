import { Lv0Builder } from '../base/level/lv0Builder.js'
import { EcoNotionBuilderObjectText } from '../blocks/notion-builder-object-text.js'
import { EcoNotionBuilderBlockToggle } from '../blocks/notion-builder-block-toggle.js'
import { EcoNotionBuilderBlockParagraph } from '../blocks/notion-builder-block-paragraph.js'
//import { EcoNotionNav1Lv4RawBlocksBuilder } from './paragraph-lv4-raw-blocks-builder.js'
export class EcoNotionParagraphLv3RawBlocksBuilder extends Lv0Builder {
  constructor () {
    super({
      name: 'EcoNotionParagraphLv3RawBlocksBuilder',
      isDebug: false,
      level: 'info',
    })
  }
  async getLv3Blocks (text, code) {
    const me = this
    const arr = []
    const block = await me.#formatItem(code)
    //console.log('getLv3Blocks item ', block)

    arr.push(block)

    return arr
  }
  // async #getChildrenLv4Blocks(relatedPageId){
  //   const db = EcoNotionNav1Lv4RawBlocksBuilder.instance
  //   return await db.getNav1Lv4Blocks(relatedPageId)
  // }
  #getContent (code) {
    if (code === 'p') return '🌳 '
    if (code === 'e') return '🪻 '
    if (code === 'v') return '🥕 '
    return ''
  }
  async #formatItem (code) {
    const me = this
    const content = me.#getContent(code)
    

    const arr = [me.#getRichTextText(content)]
    //.setChildrenBlocks(children)
    //const children = await me.#getChildrenLv4Blocks(relatedPageId)
    const block = code != 'p'? new EcoNotionBuilderBlockToggle().setRichTextArray(
      arr
    ).oBlockSafe :  new EcoNotionBuilderBlockParagraph().setRichTextArray(
      arr
    ).oBlockSafe
    // const block = new EcoNotionBuilderBlockToggle().setRichTextArray(
    //   arr
    // ).setChildrenBlocks([]).oBlockSafe 
    return block
  }

  #getRichTextText (content) {
    //const me = this

    const textObj = new EcoNotionBuilderObjectText().setContent(
      content
    ).oObjSafe
    return textObj
  }
}
