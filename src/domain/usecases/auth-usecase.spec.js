const { MissingParamError, InvalidParamError } = require('../../utils/errors')
class AuthUseCase {
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

const makeSut = () => {
  class LoadUserByEmailRopositorySpy {
    async load (email) {
      this.email = email
    }
  }
  const loadUserByEmailRopositorySpy = new LoadUserByEmailRopositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRopositorySpy)
  return {
    sut,
    loadUserByEmailRopositorySpy
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
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRopository'))
  })
  test('Should throw if no LoadUserByEmailRopository has not load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRopository'))
  })
  test('Should return null if LoadUserByEmailRopository returns null', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('invalid_email@email.com', 'any_password')
    expect(accessToken).toBeNull()
  })
})
