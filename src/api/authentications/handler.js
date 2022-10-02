class AuthenticationsHandler {
  constructor({
    authenticationsService, usersService, tokenManager, validator,
  }) {
    this._authenticationsService = authenticationsService
    this._usersService = usersService
    this._tokenManager = tokenManager
    this._validator = validator

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this)
  }

  async postAuthenticationHandler({ payload }, h) {
    this._validator.validatePostAuthenticationPayload(payload)

    const { username, password } = payload
    const id = await this._usersService.verifyUserCrendential(username, password)

    const jwtAccessToken = await this._tokenManager.generateAccessToken({ id })
    const jwtRefreshToken = await this._tokenManager.generateRefreshToken({ id })

    await this._authenticationsService.addRefreshToken(jwtRefreshToken)

    const response = h.response({
      status: 'success',
      message: 'Autentikasi berhasil!',
      data: {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      },
    })

    response.code(201)
    return response
  }

  async putAuthenticationHandler({ payload }) {
    this._validator.validatePutAuthenticationPayload(payload)

    const { refreshToken } = payload
    await this._authenticationsService.verifyRefreshToken(refreshToken)
    const { id } = await this._tokenManager.verifyRefreshToken(refreshToken)
    const jwtAccessToken = await this._tokenManager.generateAccessToken({ id })

    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken: jwtAccessToken,
      },
    }
  }

  async deleteAuthenticationHandler({ payload }) {
    this._validator.validateDeleteAuthenticationPayload(payload)

    const { refreshToken } = payload
    await this._tokenManager.verifyRefreshToken(refreshToken)
    await this._authenticationsService.deleteRefreshToken(refreshToken)

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    }
  }
}

module.exports = AuthenticationsHandler