const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}
const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare () {
      throw new Error()
    }
  }
  return new EncrypterSpy()
}
const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'
  return tokenGeneratorSpy
}
const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate () {
      throw new Error()
    }
  }
  return new TokenGeneratorSpy()
}
const makeLoadUserByEmailRopository = () => {
  class LoadUserByEmailRopositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRopositorySpy = new LoadUserByEmailRopositorySpy()
  loadUserByEmailRopositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRopositorySpy
}
const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRopositorySpy {
    async load () {
      throw new Error()
    }
  }
  return new LoadUserByEmailRopositorySpy()
}
const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositorySpy {
    async update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }
  return new UpdateAccessTokenRepositorySpy()
}
const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepositorySpy {
    async update () {
      throw new Error()
    }
  }
  return new UpdateAccessTokenRepositorySpy()
}
const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRopositorySpy = makeLoadUserByEmailRopository()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const tokenGeneratorSpy = makeTokenGenerator()
  const sut = new AuthUseCase({
    loadUserByEmailRopository: loadUserByEmailRopositorySpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })
  return {
    sut,
    loadUserByEmailRopositorySpy,
    updateAccessTokenRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
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
  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRopositorySpy } = makeSut()
    loadUserByEmailRopositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@email.com', 'valid_password')
    expect(accessToken).toBeNull()
  })
  test('Should return null if an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('valid_email@email.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRopositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@email.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRopositorySpy.user.password)
  })
  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRopositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@email.com', 'valid_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRopositorySpy.user.id)
  })
  test('Should return an accessToken if correct crendentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid_email@email.com', 'valid_password')
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })
  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, loadUserByEmailRopositorySpy, updateAccessTokenRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@email.com', 'valid_password')
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRopositorySpy.user.id)
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })
  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const loadUserByEmailRopository = makeLoadUserByEmailRopository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()
    const suts = [
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({
        loadUserByEmailRopository: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRopository
      }),
      new AuthUseCase({
        loadUserByEmailRopository,
        encrypter: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRopository,
        encrypter
      }),
      new AuthUseCase({
        loadUserByEmailRopository,
        encrypter,
        tokenGenerator: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRopository,
        encrypter,
        tokenGenerator
      }),
      new AuthUseCase({
        loadUserByEmailRopository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: invalid
      })
    ]
    for (const sut of suts) {
      const promise = sut.auth('any_email@email.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
  test('Should throw if any dependency throws', async () => {
    const loadUserByEmailRopository = makeLoadUserByEmailRopository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()
    const suts = [
      new AuthUseCase({
        loadUserByEmailRopository: makeLoadUserByEmailRepositoryWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRopository,
        encrypter: makeEncrypterWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRopository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRopository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError()
      })
    ]
    for (const sut of suts) {
      const promise = sut.auth('any_email@email.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
})
