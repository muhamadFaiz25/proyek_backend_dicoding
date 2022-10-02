class AlbumsHandler {
  constructor({ albumsService, validator }) {
    this._albumsService = albumsService
    this._validator = validator

    this.postAlbum = this.postAlbum.bind(this)
    this.getAlbumById = this.getAlbumById.bind(this)
    this.putAlbumById = this.putAlbumById.bind(this)
    this.deleteAlbumById = this.deleteAlbumById.bind(this)
  }

  async postAlbum({ payload }, h) {
    await this._validator.validateAlbumPayload(payload)
    const { name, year } = payload

    const albumId = await this._albumsService.addAlbum({ name, year })

    const response = h.response({
      status: 'success',
      data: { albumId },
    })

    response.code(201)
    return response
  }

  async getAlbumById({ params }) {
    const { id } = params
    const album = await this._albumsService.getAlbumById(id)
    const songs = await this._albumsService.getAlbumByIdWithSongs(id)

    return {
      status: 'success',
      data: {
        album: {
          ...album,
          songs,
        },
      },
    }
  }

  async putAlbumById({ params, payload }) {
    await this._validator.validateAlbumPayload(payload)
    const { id } = params
    await this._albumsService.editAlbumById(id, payload)

    return {
      status: 'success',
      message: 'Album has beed updated!',
    }
  }

  async deleteAlbumById({ params }) {
    const { id } = params
    await this._albumsService.deleteAlbumById(id)

    return {
      status: 'success',
      message: 'Album has beed deleted!',
    }
  }
}

module.exports = AlbumsHandler