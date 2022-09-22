const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class AlbumsService {
  constructor() {
    this._pool = new Pool()
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16)
    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [`album-${id}`, name, year],
    }

    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to added album')
    }

    return result.rows[0].id
  }

  async getAlbums() {
    const result = this._pool.query('SELECT * FROM albums WHERE title LIKE ')
    return result.rows
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Cannot find album ID!')
    }

    return result.rows[0]
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3',
      values: [name, year, id],
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Cannot find album ID!')
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Cannot find album ID!')
    }
  }
}

module.exports = AlbumsService