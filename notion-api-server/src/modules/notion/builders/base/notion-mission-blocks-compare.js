import { EcoBase } from '../../../../base/eco-base.js'
import { EcoNotionInputTextBuilder } from './builder-input-text-builder.js'
export class NotionMissionBlocksCompare extends EcoBase {
    _textComparer
  constructor (textComparer,
    logConfig = {
      isDebug: false,
      name: 'NotionMissionBlocksCompare',
      level: 'info',
    }
  ) {
    super(logConfig)
    this._textComparer = textComparer
  }

  #isResetTxtLine (iBlock, eBlock, comparer) {
    const me = this
   
    //console.log('🪺 iBlock', iBlock)
    //console.log('🪺 iBlock > toggle > rich_text', iBlock?.toggle?.rich_text)
    //console.log('🪺 eBlock', eBlock)
    // me._logLines(
    //   '🍎 #isResetTxtLine...',
    //   dataBlock.==,
    //   notionBlock.type
    // )
    const rs = comparer?.isMatchContent(eBlock) && comparer?.needUpdateRichText(eBlock)
    //console.log('🪺 isResetTxtLine', rs)
    //console.log('-------------------- needResetTextLine: ', rs)
    return rs
  }
  #isResetRTxt (dataRichText, notionRichtext) {
    const me = this
    const richText1 = dataRichText || []
    const richText2 = notionRichtext || []
    // me._logLines(
    //   '🌴 #checkIfNeedResetRichText...',
    //   richText1.length,
    //   richText2.length
    // )
    const rs =
      richText1.length !== richText2.length ||
      !richText1.every((text, index) => {
        const txt1 = text.plain_text
        const txt2 = richText2[index]?.plain_text
        //me._logLines('🐆 ===', txt1, txt2, '🦄 ===')
        return txt1 === txt2
      })
    //console.log('-------------------- needResetRichText', rs)
    return rs
  }

  #isResetChildren (dataChildren, notionChildren) {
    const me = this
    const children1 = dataChildren || []
    const children2 = notionChildren || []
    const l1 = children1.length
    const l2 = children2.length
    //me._logLines('🪿 #checkIfNeedResetChildren...', l1, l2)
    const rs = l1 !== l2
    //console.log('-------------------- #checkIfNeedResetChildren', rs)
    return rs
  }

  #compareNotionObjects (iBlock, eBlock) {
    const me = this
    const rs = {
      resetTextLine: false,
      resetRichText: false,
      resetChildren: false,
      resetAll: false,
    }

    const textBuilder = new EcoNotionInputTextBuilder(iBlock)
    const comparer = me._textComparer.setTextBuilder(textBuilder).prepare()

    if (me.#isResetTxtLine?.(iBlock, eBlock, comparer)) rs.resetTextLine = true

    if (me.#isResetRTxt(iBlock?.rich_text, eBlock?.rich_text)) rs.resetRichText = true

    if (me.#isResetChildren(iBlock?.children, eBlock?.children)) rs.resetChildren = true

    // needReset chỉ true khi TẤT CẢ đều true
    rs.resetAll = rs.resetTextLine && rs.resetRichText && rs.resetChildren

    return rs
  }
  compareNotionBlocks (iBlocks, eBlocks) {
    const me = this
    // me._logLines(
    //   '🪺 compareNotionBlocks: ',
    //   dataBlocks.length,
    //   existingBlocks.length
    // )
    const minLength = Math.min(iBlocks.length, eBlocks.length)

    const resetTextLineBlocks = []
    const resetRichTextBlocks = []
    const resetChildrenBlocks = []

    for (let i = 0; i < minLength; i++) {
      const comparison = me.#compareNotionObjects(
        iBlocks[i],
        eBlocks[i]
      )

      if (comparison.resetAll) {
        return {
          needReset: true,
          reason: comparison,
          index: i,
          dataBlock: iBlocks[i],
          existingBlock: eBlocks[i],
        }
      }

      if (comparison.resetTextLine) {
        resetTextLineBlocks.push({
          index: i,
          dataBlock: iBlocks[i],
          existingBlock: eBlocks[i],
        })
      }

      if (comparison.resetRichText) {
        resetRichTextBlocks.push({
          index: i,
          dataBlock: iBlocks[i],
          existingBlock: eBlocks[i],
        })
      }

      if (comparison.resetChildren) {
        resetChildrenBlocks.push({
          index: i,
          dataBlock: iBlocks[i],
          existingBlock: eBlocks[i],
        })
      }
    }

    const result = {
      resetTextLineBlocks,
      resetRichTextBlocks,
      resetChildrenBlocks,
    }

    if (iBlocks.length > eBlocks.length) {
      result.needAddItems = iBlocks.slice(eBlocks.length)
    } else if (eBlocks.length > iBlocks.length) {
      result.needRemoveItems = eBlocks.slice(iBlocks.length)
    } else if (
      resetTextLineBlocks.length === 0 &&
      resetRichTextBlocks.length === 0 &&
      resetChildrenBlocks.length === 0
    ) {
      result.equal = true
    }
   
    return result
  }
}
