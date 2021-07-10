const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
    }
  }

  const encryterSpy = new EncrypterSpy()
  class LoadUserByEmailRopositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRopositorySpy = new LoadUserByEmailRopositorySpy()
  loadUserByEmailRopositorySpy.user = {
    password: 'hashed_password'
  }
  const sut = new AuthUseCase(loadUserByEmailRopositorySpy, encryterSpy)
  return {
    sut,
    loadUserByEmailRopositorySpy,
    encryterSpy
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should call LoadUserByEmailRopository with correct email', async () => {
    const { sut, loadUserByEmailRopositorySpy } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')
    expect(loadUserByEmailRopositorySpy.email).toBe('any_email@email.com')
  })
  test('Should throw if no LoadUserByEmailRopository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow()
  })
  test('Should throw if no LoadUserByEmailRopository has not load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow()
  })
  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRopositorySpy } = makeSut()
    loadUserByEmailRopositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@email.com', 'valid_password')
    expect(accessToken).toBeNull()
  })
  test('Should return null if an invalid password is provided', async () => {
    const { sut, loadUserByEmailRopositorySpy } = makeSut()
    loadUserByEmailRopositorySpy.user = null
    const accessToken = await sut.auth('valid_email@email.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRopositorySpy, encryterSpy } = makeSut()
    await sut.auth('valid_email@email.com', 'any_password')
    expect(encryterSpy.password).toBe('any_password')
    expect(encryterSpy.hashedPassword).toBe(loadUserByEmailRopositorySpy.user.password)
  })
})
