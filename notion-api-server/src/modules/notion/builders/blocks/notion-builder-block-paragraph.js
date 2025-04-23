import { EcoNotionBuilderBlockBase } from './notion-builder-block-base.js'
export class EcoNotionBuilderBlockParagraph extends EcoNotionBuilderBlockBase {
  get _objectType () {
    return 'paragraph'
  }
//TODO: Appply
  constructor () {
    super({ name: 'EcoNotionBuilderBlockParagraph', isDebug: false, level: 'info' })
  }

  
}
