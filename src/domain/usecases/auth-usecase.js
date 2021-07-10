const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRopository, encryterSpy) {
    this.loadUserByEmailRopository = loadUserByEmailRopository
    this.encryterSpy = encryterSpy
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUserByEmailRopository.load(email)
    if (!user) {
      return null
    }
    await this.encryterSpy.compare(password, user.password)
  }
}
