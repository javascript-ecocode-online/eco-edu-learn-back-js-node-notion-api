import { EcoBase } from '../../../base/eco-base.js'
export class NotionMissionBlocksCompare extends EcoBase {
  _getTextComparer
  constructor (
    getTextComparer,
    logConfig = {
      isDebug: false,
      name: 'NotionMissionBlocksCompare',
      level: 'info',
    }
  ) {
    super(logConfig)
    this._getTextComparer = getTextComparer
  }

  #compareNotionObjects (index, iBlock, eBlock) {
    const me = this
    //console.log('🍋 textBuilder: ', iBlock.toggle.rich_text)

    const comparer = me._getTextComparer(index, iBlock)
    const isMatch = comparer?.isMatchContent(eBlock)
    const isUpdate = comparer?.needUpdateRichText(eBlock)
    const isReset = isMatch && isUpdate
    const isDiff = iBlock.type !== eBlock.type || !isMatch
    //console.log(index, `isMatch: ${isMatch} / isUpdate: ${isUpdate}`)
    return { isDiff: isDiff, isReset: isReset }
  }

  compareNotionBlocks (iBlocks, eBlocks) {
    const me = this
    //me._logLines('🪺 compareNotionBlocks 1: ', iBlocks.length, eBlocks.length)
    const minLength = Math.min(iBlocks?.length ?? 0, eBlocks?.length ?? 0)
    //me._logLines('🪺 minLength: ', minLength)
    const needChangeRichTextBlocks = []
    const needReplaceBlocks = []
    const skipBlocks = []
    let isDiffAssigned = false
    for (let i = 0; i < minLength; i++) {
      const crs = me.#compareNotionObjects(i, iBlocks[i], eBlocks[i])
      const isBegin = !isDiffAssigned
      if (crs.isDiff) {
        isDiffAssigned = true
      }
      const obj = { index: i, iBlock: iBlocks[i], eBlock: eBlocks[i] }
      if (isDiffAssigned) {
        // 🇻🇳 Chỉ cần 1 lần diff là từ đó về sau phải xóa đi add lại
        obj.reason =
          isBegin && crs.isDiff
            ? 'first diff'
            : crs.isDiff
            ? 'next diff: ' + crs.isReset
            : 'equal but after diff'
        needReplaceBlocks.push(obj)
      } else if (crs.isReset) {
        // 🇻🇳 resetRichTextBlocks luôn phải là các blocks đứng trước reAddRichTextBlocks
        needChangeRichTextBlocks.push(obj)
      } else {
        //console.log('🐞 skipBlock', obj)
        skipBlocks.push(obj)
      }
    }
    const noChangeRichText = needChangeRichTextBlocks.length === 0
    const noReplace = needReplaceBlocks.length === 0
    const isInMinNoChange = noChangeRichText && noReplace
    const isLengthEqual = iBlocks?.length === eBlocks?.length
    const isEqualAll = isLengthEqual && isInMinNoChange
    const result = {
      isEqualAll: isEqualAll,
      skipBlocks: skipBlocks,
      needChangeRichTextBlocks: needChangeRichTextBlocks,
      needReplaceBlocks: needReplaceBlocks,
    }
    //console.log('----', (iBlocks?.length ?? 0))
    //console.log('----', (eBlocks?.length ?? 0))
    if ((iBlocks?.length ?? 0) > (eBlocks?.length ?? 0)) {
      //console.log('----')
      result.needAddBlocks = iBlocks.slice(eBlocks?.length ?? 0)
    } else if ((eBlocks?.length ?? 0) > (iBlocks?.length ?? 0)) {
      //if (iBlocks?.length)
      result.needRemoveBlocks = eBlocks.slice(iBlocks?.length ?? 0)
    }

    // me.#logArrayBlocks(
    //   'needChangeRichTextBlocks',
    //   result.needChangeRichTextBlocks
    // )
    // me.#logArrayBlocks('needReplaceBlocks', result.needReplaceBlocks)
    // me.#logArrayBlocks('needAddBlocks', result.needAddBlocks)
    // me.#logArrayBlocks('needRemoveBlocks', result.needRemoveBlocks)
    // me.#logArrayBlocks('skipBlocks', result.skipBlocks)
    return result
  }
  #logArrayBlocks (name, blocks) {
    if (!blocks || blocks.length === 0) return
    console.log('===== 🥥 Begin log: ', name)
    blocks?.forEach((element, index) => {
      console.log(`--- 🦯 begin block: ${index}`)
      const iRt = element?.iBlock
        ? element?.iBlock[element?.iBlock?.type]?.rich_text
        : null
      if (iRt) console.log('iBlock richText: ', iRt)
      const eRt = element?.eBlock
        ? element?.eBlock[element?.eBlock?.type]?.rich_text
        : null
      if (eRt) console.log('eBlock richText: ', eRt)

      if (!iRt && !eRt) {
        const xRt = element ? element[element?.type]?.rich_text : null
        if (xRt) console.log('xBlock richText: ', xRt)
      }
      console.log('element: ', element) // hoặc gọi hàm của bạn ở đây
      console.log(`--- end block: ${index}`)
    })
    console.log('===== End log: ', name)
  }
}
