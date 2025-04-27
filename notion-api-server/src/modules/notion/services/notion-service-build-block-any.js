import { EcoNotionServiceBuildBlockBase as Base } from './notion-service-build-block-base.js'

export class EcoNotionServiceBuildBlockAny extends Base {
  constructor () {
    super({
      name: 'EcoNotionServiceBuildBlockAny',
      isDebug: false,
      level: 'info',
    })
  }

  async deleteBlock (blockId) {
    const me = this
    return await me._blocks.update({
      block_id: blockId,
      archived: true,
    })
  }

  async updateRichText (type, blockId, richTextArr) {
    const me = this
    return await me._updateRichText(type, blockId, richTextArr)
  }
}
