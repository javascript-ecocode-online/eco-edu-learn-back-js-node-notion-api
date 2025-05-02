import { Lv0Builder } from '../base/level/lv0Builder.js'
//import { NotionBuilderLv4DataLearnLinks } from './lv4/notion-builder-lv4-data-learn-links.js'
//import { NotionBuilderLv4DataBuildLink } from './lv4/notion-builder-lv4-data-build-link.js'
//import { NotionBuilderLv4DataImageLink } from './lv4/notion-builder-lv4-data-image-link.js'

export class EcoNotionParagraphLv4RawBlocksBuilder extends Lv0Builder {
  constructor () {
    super({
      name: 'EcoNotionParagraphLv4RawBlocksBuilder',
      isDebug: false,
      level: 'info',
    })
  }
  // #getLearnLinksIBlocks (relatedPageId) {
  //   return new NotionBuilderLv4DataLearnLinks()
  //     .setTargetPageId(relatedPageId)
  //     .build().resultBlock
  // }
  // #getBuildLinkIBlocks (relatedPageId) {
  //   return new NotionBuilderLv4DataBuildLink()
  //     .setTargetPageId(relatedPageId)
  //     .build().resultBlock
  // }
  // async #getImageLinkIBlock (relatedPageId) {
  //   let svc = new NotionBuilderLv4DataImageLink().setTargetPageId(relatedPageId)
  //   svc = await svc.build()
  //   return svc.resultBlock
  // }
  // async getNav1Lv4Blocks (relatedPageId) {
  //   const me = this
  //   const arr = []
  //   const learnLinksBlock = me.#getLearnLinksIBlocks(relatedPageId)
  //   const buildLinkBlock = me.#getBuildLinkIBlocks(relatedPageId)
  //   const imageLinkBlock = await me.#getImageLinkIBlock(relatedPageId)
  //   if (learnLinksBlock) arr.push(learnLinksBlock)
  //   if (buildLinkBlock) arr.push(buildLinkBlock)
  //   if (imageLinkBlock) arr.push(imageLinkBlock)
  //   //console.log('🪽 imageLinkBlock: ', imageLinkBlock)
  //   return arr
  // }
}
