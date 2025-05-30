import { EcoBuilderBlockComparerBase as Base } from './builder-block-comparer-base.js'

import { EcoNotionTaskBlockMapText as mt } from '../../../tasks/notion-task-block-map-text.js'

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
    const links = textBuilder?.getTextLinks()
    //console.log('🛸 iLinks', links)
    //console.log('🔗 inputLinks', links)
    return links
  }

  #isMatchTextLinks (block, inputCompareLinks) {
    const me = this
    const existingCompareTextLinks = me.#getDefaultRichTextCompareLinks(block)
    //console.log('🔗 existingCompareTextLinks', existingCompareTextLinks)
    //console.log(block)
    return me.#compareLinksAndLinks(inputCompareLinks, existingCompareTextLinks)
  }

  #getDefaultRichTextCompareLinks (block) {
    //const me = this
    const richTexts = block[block.type].rich_text || []
    //console.log('getTextLinks 2: ', richTexts)
    const arrLinks = mt.getTextLinksFromRichText(richTexts)
    //console.log('🛸 eLinks', arrLinks)
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
    // console.log(inputCompareLinks)
    // console.log(existingCompareTextLinks)

    const arr1 = inputCompareLinks
    const arr2 = existingCompareTextLinks
    if (!arr1?.length && !arr2?.length) return false
    //if (arr1?.length || arr2?.length) console.log(arr1, arr2)
    if (arr1?.length !== arr2?.length) return false // khác độ dài => khác chắc chắn

    for (let i = 0; i < arr1.length; i++) {
      const url1 = me.#cleanUrl(arr1[i])
      const url2 = me.#cleanUrl(arr2[i])
      if (url1 !== url2) {
        //console.log('- compareLinksAndLinks diff: ')

        return false // chỉ cần khác 1 phần tử => khác
      }
    }
    // console.log('- ipt: ', inputCompareLinks)
    // console.log('- ext: ', existingCompareTextLinks)
    return true
  }
}
