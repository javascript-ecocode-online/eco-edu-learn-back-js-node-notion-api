import { EcoBuilderBlockFindUpdate as Base } from './builder-block-find-update.js'

export class EcoNotionBuilderLv1Master extends Base {
  _pageId
  _buildCfg

  get _isResetChildren () {
    return this._buildCfg?.isResetChildren ?? false
  }
  constructor (logCfg, pageId, buildCfg) {
    super(pageId, logCfg)
    this._pageId = pageId
    this._buildCfg = buildCfg
  }

  async _onExecuteDone (lv1BlockId) {
    throw new Error(`Need implement _onExecuteDone, lv1BlockId: ${lv1BlockId}`)
  }
  async _buildLv3BlocksForExtgLv2Blocks (lv1BlockId, lv2ExtgBlocks) {
    console.log(`Không có block lv3 cho block lv1: ${lv1BlockId}...`)
  }
}
