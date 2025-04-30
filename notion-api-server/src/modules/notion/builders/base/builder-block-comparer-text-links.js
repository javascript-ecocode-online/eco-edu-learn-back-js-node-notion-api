import { EcoBuilderBlockComparerBase as Base } from './builder-block-comparer-base.js'

import { EcoNotionTaskBlockMapText as mt } from '../../tasks/notion-task-block-map-text.js'

export class EcoBuilderBlockComparerTextLinks extends Base {
  _inputCompareLinks
  constructor (
    textBuilder,
    logConfig = {
      isDebug: false,
      name: 'EcoBuilderBlockComparerTextLinks',
      level: 'info',
    }
  ) {
    super(textBuilder, logConfig)
  }

  prepare () {
    const me = this
    me._inputCompareLinks = me.#inputLinks()
    return me
  }

  isMatch (block) {
    const me = this
    const inputCompareLinks = me._inputCompareLinks
    return me.#isMatchTextLinks(block, inputCompareLinks)
  }

  #inputLinks () {
    const me = this
    const textBuilder = me._textBuilder
    return textBuilder?.getTextLinks()
  }

  #isMatchTextLinks (block, inputCompareLinks) {
    const me = this
    const existingCompareTextLinks = me.#getDefaultRichTextCompareLinks(block)
    return me.#compareLinksAndLinks(inputCompareLinks, existingCompareTextLinks)
  }

  #getDefaultRichTextCompareLinks (block) {
    //const me = this
    const richTexts = block[block.type].rich_text || []
    const arrLinks = mt.getTextLinksFromRichText(richTexts)

    return arrLinks
  }

  #cleanUrl (url) {
    return url.replace(/\/\?/, '?') // thay "/?" thành "?"
  }

  #compareLinksAndLinks (inputCompareLinks, existingCompareTextLinks) {
    const me = this
    // console.log(
    //   '💥 compareLinksAndLinks',
    //   'inputCompareLinks vs existingCompareTextLinks'
    // )
    // console.log('- ipt: ', inputCompareLinks)
    // console.log('- ext: ', existingCompareTextLinks)
    const arr1 = inputCompareLinks
    const arr2 = existingCompareTextLinks
    //if (arr1?.length || arr2?.length) console.log(arr1, arr2)
    if (arr1?.length !== arr2?.length) return false // khác độ dài => khác chắc chắn

    for (let i = 0; i < arr1.length; i++) {
      if (me.#cleanUrl(arr1[i]) !== me.#cleanUrl(arr2[i])) {
        //console.log('- compareLinksAndLinks diff: ')

        return false // chỉ cần khác 1 phần tử => khác
      }
    }
    //console.log('- rs: ', true)
    return true
  }
}
