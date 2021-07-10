const { MissingParamError, InvalidParamError } = require('../../utils/errors')

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
    if (!this.loadUserByEmailRopository) {
      throw new MissingParamError('loadUserByEmailRopository')
    }
    if (!this.loadUserByEmailRopository.load) {
      throw new InvalidParamError('loadUserByEmailRopository')
    }
    const user = await this.loadUserByEmailRopository.load(email)
    if (!user) {
      return null
    }
  }
}
