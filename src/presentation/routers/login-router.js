const HttpResonse = require('../helpers/http-response')
module.exports = class LoginRouter {
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
  }
}
