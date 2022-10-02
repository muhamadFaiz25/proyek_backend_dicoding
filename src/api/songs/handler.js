class SongsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postSongHandler = this.postSongHandler.bind(this)
    this.getSongsHandler = this.getSongsHandler.bind(this)
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload)
    const {
      title = 'untitled', year, performer, genre, duration = null, albumId = null,
    } = request.payload

    const songId = await this._service.addSongs({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    })

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: { songId },
    })

    response.code(201)
    return response
  }

  async getSongsHandler({ query }) {
    const { title = '', performer = '' } = query
    const getSongs = await this._service.getSongs({ title, performer })

    return {
      status: 'success',
      data: {
        songs: getSongs,
      },
    }
  }

  async getSongByIdHandler({ params }) {
    const { songId } = params
    const getSong = await this._service.getSongById(songId)

    return {
      status: 'success',
      data: {
        song: getSong,
      },
    }
  }

  async putSongByIdHandler({ payload, params }) {
    this._validator.validateSongPayload(payload)
    const { songId } = params

    await this._service.editSongById(songId, payload)

    return {
      status: 'success',
      message: 'song has been updated!',
    }
  }

  async deleteSongByIdHandler({ params }) {
    const { songId } = params
    await this._service.deleteSongById(songId)

    return {
      status: 'success',
      message: 'song has been deleted!',
    }
  }
}

module.exports = SongsHandler