import { EcoBase as Base } from '../../../../../base/eco-base.js'

export class EcoBuilderBlockComparerBase extends Base {
  _textBuilder
  constructor (
    textBuilder,
    logConfig = {
      isDebug: false,
      name: 'EcoBuilderBlockComparerBase',
      level: 'info',
    }
  ) {
    super(logConfig)
    this._textBuilder = textBuilder
  }
  _displayText () {
    const me = this
    const textBuilder = me._textBuilder
    return textBuilder?.getDisplayText()
  }
  _compareTextAndText (inputCompareText, existingCompareText) {
    // if(this._logName === 'EcoNotionBuilderNav1Lv2Comparer'){
    //console.log('🪭 _compareTextAndText', this._logName)
    console.log('- ipt: ', inputCompareText)
    console.log('- ext: ', existingCompareText)
   
    return inputCompareText === existingCompareText
  }
}
