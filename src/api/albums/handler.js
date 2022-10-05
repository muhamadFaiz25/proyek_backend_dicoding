class AlbumsHandler {
  constructor({ albumsService, validator }) {
    this._albumsService = albumsService
    this._validator = validator

    this.postAlbum = this.postAlbum.bind(this)
    this.getAlbumById = this.getAlbumById.bind(this)
    this.putAlbumById = this.putAlbumById.bind(this)
    this.deleteAlbumById = this.deleteAlbumById.bind(this)
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this)
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this)
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this)
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

  async postAlbumCoverHandler({ payload, params }, h) {
    const { cover } = payload
    const { id } = params

    this._validator.validateUploadCoverHeadersSchema(cover.hapi.headers)
    const filename = await this._albumsService.uploadCover(cover)
    await this._albumsService.editAlbumCoverById(id, filename)

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    })

    response.code(201)
    return response
  }

  async postAlbumLikeHandler({ params, auth }, h) {
    const { id } = params
    const { id: userId } = auth.credentials

    const isAlbumsLike = await this._albumsService.verifyExistAlbumLikeStatusById(id, userId)
    if (isAlbumsLike > 0) {
      await this._albumsService.deleteAlbumLikeStatusById(id, userId)
      const response = h.response({
        status: 'success',
        message: 'Berhasil melakukan dislike pada album!',
      })
      response.code(201)
      return response
    } else {
      await this._albumsService.addAlbumLikeStatus(id, userId)

      const response = h.response({
        status: 'success',
        message: 'Berhasil menyukai album!',
      })
      response.code(201)
      return response
    }
  }

  async getAlbumLikesHandler({ params }, h) {
    const { id } = params
    const { count, isCache } = await this._albumsService.getAlbumLikesCountByAlbumId(id)

    const response = {
      status: 'success',
      data: { likes: count },
    }

    if (isCache) {
      return h.response(response).header('X-Data-Source', 'cache')
    }

    return response
  }
}

module.exports = AlbumsHandler