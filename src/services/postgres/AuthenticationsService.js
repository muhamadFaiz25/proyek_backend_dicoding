const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')

class AuthenticationsService {
  constructor() {
    this._pool = new Pool()
  }

  async addRefreshToken(refreshToken) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [refreshToken],
    }

    await this._pool.query(query)
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [refreshToken],
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid...')
    }
  }

  async deleteRefreshToken(refreshToken) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    }

    await this._pool.query(query)
  }
}

module.exports = AuthenticationsService