module.exports = class Invalid extends Error {
  constructor (paramName) {
    super(`Invalid param ${paramName}`)
    this.name = 'Invalid'
  }
}
