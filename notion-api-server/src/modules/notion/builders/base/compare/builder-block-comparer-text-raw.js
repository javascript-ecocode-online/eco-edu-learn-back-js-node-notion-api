import { EcoBuilderBlockComparerBase as Base } from './builder-block-comparer-base.js'
import { EcoTextUtil as uTxt } from '../../../../../utils/text.js'
import { EcoNotionTaskBlockMapText as mt } from '../../../tasks/notion-task-block-map-text.js'

export class EcoBuilderBlockComparerTextRaw extends Base {
  _inputCompareText
  constructor (
    textBuilder,
    logConfig = {
      isDebug: false,
      name: 'EcoBuilderBlockComparerTextRaw',
      level: 'info',
    }
  ) {
    super(textBuilder, logConfig)
  }
  //_txtc
  prepare () {
    const me = this
    me._inputCompareText = me.#getIText()

    return me
  }

  isMatch (block, isEqualMode) {
    const me = this
    const inputCompareText = me._inputCompareText
    return me.#isMatchRawContent(block, inputCompareText, isEqualMode)
  }

  #getIText () {
    const me = this
    const displayText = me._displayText()
    //console.log('🎋 displayText', displayText)
    const rs = uTxt.normalizeText(displayText)
    //console.log('🛸 raw itext', rs)
    return rs
  }

  #isMatchRawContent (block, inputCompareText, isEqualMode) {
    const me = this
    let existingCompareText = me.#getEText(block)

    if (!isEqualMode) {
      const c1 = existingCompareText?.includes('back')
      const c2 = existingCompareText?.includes('chid')
      const c3 = existingCompareText?.includes('next')
      if (c1 && c2 && c3) {
        existingCompareText = existingCompareText?.replace(' chid ', ' child ')
      }
    }

    // console.log()
    //console.log('🥖 inputCompareText: ', inputCompareText)
    //console.log('🥖 existingCompareText: ', existingCompareText)
    // console.log()
    return me._compareTextAndText(
      inputCompareText,
      existingCompareText,
      isEqualMode
    )
  }

  #getEText (block) {
    //const me = this
    const richTexts = (block ? block[block.type]?.rich_text : []) || []
    const plainText = mt.getBlockDisplayTextFromNotionRichTextArr(richTexts)
    //console.log('🌽 plainText', plainText)
    //console.log('💎 rich_text', block.toggle.rich_text)
    const rsText = uTxt.normalizeText(plainText)
    //console.log('🛸 raw etext', rsText)
    //console.log('🌱 #getDefaultRichTextCompareString', existingCompareText)
    return rsText
  }
}
