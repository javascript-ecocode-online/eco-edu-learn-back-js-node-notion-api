export class EcoNotionTaskBlockMapText {
  static getRichTextItemDisplayTextFromRaw (rt) {
    if (rt.type === 'text') return rt.text.content
    if (rt.type === 'mention') {
      //console.log('🌙 mention rich_text: ', rt)
      return rt.plain_text 
    }
    if (rt.type === 'equation') return rt.equation.expression
    return ''
  }

  static getRichTextItemDisplayTextFromNotion (rt) {
    return rt.plain_text
  }

  static getBlockDisplayTextFromInputRichTextArr (richTextArray) {
    const me = this
    const text = richTextArray?.map(rt => me.getRichTextItemDisplayTextFromRaw(rt))
      .join('')
    //console.log('+⛵️ getBlockDisplayTextFromInputRichTextArr: ', text)
    return text
  }

  static getBlockDisplayTextFromNotionRichTextArr (richTexts) {
    const me = this
    const text =
      richTexts
        .map(rt => me.getRichTextItemDisplayTextFromNotion(rt))
        .join('')
        .trim() ?? ''
    //console.log('#⛵️ getBlockDisplayTextFromNotionRichTextArr: ', text)
    return text
  }

  static getTextLinksFromRichText (richTexts) {
    //const me = this
    const arr = richTexts?.filter(rt => {
      let isEqual = rt && rt.type === 'text' && (rt.href || rt.text?.link?.url)
      return isEqual
    })
      ?.map(rt => rt.href? rt.href: rt.text?.link?.url)

    //console.log('🔗 getTextLinksFromRichText: ', arr)
    // if(arr.length === 0){
    //   console.log('🔗 empty: ', richTexts[1])
    // }
    return arr
  }

  static getMentionIdsFromRichText (richTexts) {
    //const me = this
    const arr = richTexts?.filter(rt => {
      let isEqual = rt && rt.type === 'mention' && rt[rt.type]?.page?.id
      // if(rt.type === 'mention'){
      //   console.log('🛸 mention page: ', rt[rt.type].page)
      // }
      return isEqual
    })
      ?.map(rt => rt[rt.type].page.id)

    //console.log('🔗 getTextLinksFromRichText: ', arr)
    // if(arr.length === 0){
    //   console.log('🔗 empty: ', richTexts[1])
    // }
    return arr
  }
}
