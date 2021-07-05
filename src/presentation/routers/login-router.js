const HttpResonse = require('../helpers/http-response')
const MissingParamError = require('../helpers/missing-param-error')
module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResonse.badRequest(new MissingParamError('email'))
      }
      if (!password) {
        return HttpResonse.badRequest(new MissingParamError('password'))
      }
      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpResonse.unauthorizedError()
      }
      return HttpResonse.ok({ accessToken })
    } catch (error) {
      return HttpResonse.serverError()
    }
  }
}
