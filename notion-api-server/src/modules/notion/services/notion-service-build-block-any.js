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
    me._logLines('🔥 Start deleteBlock ...', blockId)
    const rs = await me._blocks.update({
      block_id: blockId,
      archived: true,
    })
    me._logLines('🔥 Delete block:', rs)
    return rs
  }

  async updateRichText (type, blockId, richTextArr) {
    const me = this
    return await me._updateRichText(type, blockId, richTextArr)
  }
}
