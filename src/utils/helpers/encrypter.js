const bcrypt = require('bcrypt')
module.exports = class Encrypter {
  async compare (value, hashedValue) {
    const isVald = await bcrypt.compare(value, hashedValue)
    return isVald
  }
}
