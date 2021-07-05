const HttpResonse = require('../helpers/http-response')
module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResonse.badRequest('email')
      }
      if (!password) {
        return HttpResonse.badRequest('password')
      }
      const accessToken = this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpResonse.unauthorizedError()
      }
      return HttpResonse.ok({ accessToken })
    } catch (error) {
      return HttpResonse.serverError()
    }
  }
}
