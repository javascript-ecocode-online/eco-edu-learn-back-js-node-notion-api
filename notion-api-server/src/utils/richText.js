export function getToggleRichText(block){
    const rs = block.toggle.rich_text
    .map(textItem => textItem.plain_text)
    .join('')
    //console.log('getToggleRichText: ', rs)
    return rs;
}
export function getToggleMentionPageId(block){
   
    const rs = block.toggle.rich_text.filter(textItem => textItem.type === 'mention' && textItem.mention.type === 'page')
    .map(textItem => {
        //console.log('>: ', textItem)
        return textItem.mention.page.id
    })
    .join('')

    
    return rs;
}