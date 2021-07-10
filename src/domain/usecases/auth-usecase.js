const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRopository) {
    this.loadUserByEmailRopository = loadUserByEmailRopository
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
  }
}
