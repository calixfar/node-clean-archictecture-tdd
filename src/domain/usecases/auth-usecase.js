const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRopository, encryter, tokenGenerator) {
    this.loadUserByEmailRopository = loadUserByEmailRopository
    this.encryter = encryter
    this.tokenGenerator = tokenGenerator
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
    const isValid = await this.encryter.compare(password, user.password)
    if (!isValid) {
      return null
    }
    const accessToken = await this.tokenGenerator.generate(user.id)
    return accessToken
  }
}
