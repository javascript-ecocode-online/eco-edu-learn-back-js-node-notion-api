import autoBind from 'auto-bind'

export class EcoRouterController {
  constructor (cfg) {
    autoBind(this)
    this.cfg = cfg
    console.log('🌳 EcoRouterController > constructor: ', cfg.name)
    //this.getChildren = this.getChildren.bind(this);
  }
  #logBeginRequest (funcName) {
    const cfg = this.cfg
    console.log(
      `🌳 EcoRouterController > ${cfg.name} > Begin request: `,
      funcName
    )
  }

  async _execRequest (name, res, func) {
    const me = this
    me.#logBeginRequest(name)

    try {
      await func()
    } catch (err) {
      me.#logRequestError(name, err)
      res.status(500).json({ error: err.message })
    }

    me.#logEndRequest(name)
  }

  #logRequestError (funcName, err) {
    const cfg = this.cfg
    console.log(` EcoRouterController > ${cfg.name} > Error ${funcName}: `, err)
  }

  #logEndRequest (funcName) {
    const cfg = this.cfg
    console.log(
      `🌳 EcoRouterController > ${cfg.name} > End request: `,
      funcName
    )
  }
}
