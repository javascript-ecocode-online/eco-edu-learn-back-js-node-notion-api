import { EcoBuilderBlockComparerBase as Base } from './builder-block-comparer-base.js'

import { EcoNotionTaskBlockMapText as mt } from '../../../tasks/notion-task-block-map-text.js'

export class EcoBuilderBlockComparerTextMentions extends Base {
  _inputCompareLinks
  constructor (
    textBuilder,
    logConfig = {
      isDebug: false,
      name: 'EcoBuilderBlockComparerTextMentions',
      level: 'info',
    }
  ) {
    super(textBuilder, logConfig)
  }
//txmc
//prepareMentionIds
  prepare () {
    const me = this
    me._inputCompareLinks = me.#inputLinks()
    return me
  }

  isMatch (block) {
    const me = this
    const iIds = me._inputCompareLinks
    return me.#isMatchTextLinks(block, iIds)
  }

  #inputLinks () {
    const me = this
    const textBuilder = me._textBuilder
    const ids = textBuilder?.getMentionIds()
    console.log('🔗 mention iIds', ids)
    return ids
  }

  #isMatchTextLinks (block, iIds) {
    const me = this
    const eIds = me.#getDefaultRichTextCompareLinks(block)
    //console.log('🔗 isMatchTextLinks> mention ids', eIds)
    //onsole.log(block)
    return me.#compareIdsAndIds(iIds, eIds)
  }

  #getDefaultRichTextCompareLinks (block) {
    //const me = this
    const richTexts = block[block.type].rich_text || []
    //console.log('getTextLinks 2: ', richTexts)
    const arrLinks = mt.getMentionIdsFromRichText(richTexts)
    console.log('🔗 mention eIds', arrLinks)
    return arrLinks
  }

  #cleanUrl (url) {
    return url.replace(/\/\?/, '?') // thay "/?" thành "?"
  }

  #compareIdsAndIds (iIds, eIds) {
    const me = this
    //console.log('💥 compareIdsAndIds', 'iIds vs eIds')
    //console.log(iIds)
    //console.log(eIds)

    const arr1 = iIds
    const arr2 = eIds
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
