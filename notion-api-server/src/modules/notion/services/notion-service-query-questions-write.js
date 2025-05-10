import { EcoNotionServiceQueryQuestions as Base } from './notion-service-query-questions.js'
import { EcoTextUtil as uTxt } from '../../../utils/text.js'

export class EcoNotionServiceQueryWriteQuestions extends Base {
  constructor () {
    super({
      name: 'EcoNotionServiceQueryWriteQuestions',
      isDebug: false,
      level: 'info',
    })
  }

  #getReplacedQuestionContent (sentence, phrase) {
    if (!phrase) return sentence

    const wordCount = phrase.trim().split(/\s+/).length
    const replacement = Array(wordCount).fill('...').join(' ')

    return sentence.replace(phrase, replacement)
  }

  #getEnQuestion (eSentence, vSentence, question) {
    const me = this
    const phrase = uTxt.removeEmoji(question?.phrase)
    const id = question.id3
    const phraseHint = question.translation
    const source = question.source
    const content = me.#getReplacedQuestionContent(eSentence, phrase)
    if (content) {
      const rs = {
        id: id,
        type: 'en',
        sEn: eSentence,
        qEn: content,
        sVn: vSentence,
        aEn: phrase,
        aVn: phraseHint,
        sSc: source,
      }
      return rs
    }
    return null
  }

  #getEnQuestions (eSentence, vSentence, eQuestions) {
    const me = this
    const arr = []
    eQuestions?.forEach((q, i) => {
      //console.log(`----- 🛸 processing eq: -----`, q)
      const oQuestion = me.#getEnQuestion(eSentence, vSentence, q)
      if (oQuestion) {
        //console.log(`oQuestion`, oQuestion)
        arr.push(oQuestion)
      }
    })
    return arr
  }

  #getVnQuestion (eSentence, vSentence, question) {
    const me = this
    const phrase = uTxt.removeEmoji(question?.phrase)
    const id = question.id3
    const phraseHint = question.translation
    const context = question.context
    const content = me.#getReplacedQuestionContent(eSentence, context)
    if (content) {
      const rs = {
        id: id,
        type: 'vn',
        sEn: eSentence,
        qVn: phrase,
        qEn: content,
        sVn: vSentence,
        aEn: phraseHint,
        aCt: context,
      }
      return rs
    }
    return null
  }

  #getVnQuestions (eSentence, vSentence, vQuestions) {
    const me = this
    const arr = []
    vQuestions?.forEach((q, i) => {
      console.log(`----- 🛸 processing vq: -----`, q)
      const oQuestion = me.#getVnQuestion(eSentence, vSentence, q)
      if (oQuestion) {
        console.log(`oQuestion`, oQuestion)
        arr.push(oQuestion)
      }
    })
    return arr
  }

  async getPageWriteQuestion (reason, pageId) {
    const me = this
    const data = await me.getPageQuestion(reason, pageId)
    let rs = []
    data?.forEach((o, i) => {
      const id1 = o?.id1
      const oEn = o?.en
      const oVn = o?.vn
      const eSentence = oEn?.sentence
      const vSentence = oVn?.sentence
      const eQuestions = oEn?.questions
      const vQuestions = oVn?.questions
      const hasEnQuestions = eQuestions?.length && eSentence && vSentence
      console.log(`----- 🛸 processing block lv1: ----- ${id1}`)

      //console.log(eSentence)
      //console.log(vSentence)
      if (hasEnQuestions) {
        const enQuestions = me.#getEnQuestions(eSentence, vSentence, eQuestions)
        if (enQuestions?.length) rs = rs.concat(enQuestions)
      }

      const hasVnQuestions = vQuestions?.length && eSentence && vSentence
      console.log(vQuestions)
      if (hasVnQuestions) {
        const vnQuestions = me.#getVnQuestions(eSentence, vSentence, vQuestions)
        if (vnQuestions?.length) rs = rs.concat(vnQuestions)
      }
    })
    return rs
  }
}
