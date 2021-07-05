const HttpResonse = require('../helpers/http-response')
module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResonse.serverError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResonse.badRequest('email')
    }
    if (!password) {
      return HttpResonse.badRequest('password')
    }
    this.authUseCase.auth(email, password)
    return HttpResonse.unauthorizedError()
  }
}
