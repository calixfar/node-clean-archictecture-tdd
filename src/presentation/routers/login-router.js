const HttpResonse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../errors')
module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResonse.badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResonse.badRequest(new InvalidParamError('email'))
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
