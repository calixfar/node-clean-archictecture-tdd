const bcrypt = require('bcrypt')
const { MissingParamError } = require('../errors')
module.exports = class Encrypter {
  async compare (value, hash) {
    if (!value) {
      throw new MissingParamError('value')
    }
    if (!hash) {
      throw new MissingParamError('hash')
    }
    const isVald = await bcrypt.compare(value, hash)
    return isVald
  }
}
