class playlistsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this)
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this)
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this)
    this.getPlalistActivitiesHandler = this.getPlalistActivitiesHandler.bind(this)
  }

  async postPlaylistHandler({ payload, auth }, h) {
    this._validator.validatePostPlaylistSchema(payload)
    const { name } = payload

    const { id: credentialId } = auth.credentials
    const id = await this._service.addPlaylist(name, credentialId)

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId: id,
      },
    })

    response.code(201)
    return response
  }

  async getPlaylistsHandler({ auth }) {
    const { id: userId } = auth.credentials
    const result = await this._service.getPlaylists(userId)

    return {
      status: 'success',
      data: {
        playlists: result,
      },
    }
  }

  async deletePlaylistHandler({ auth, params }) {
    const { playlistId } = params
    const { id: credentialId } = auth.credentials

    await this._service.verifyPlaylistOwner(playlistId, credentialId)
    await this._service.deletePlaylistById(playlistId)

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    }
  }

  async postSongToPlaylistHandler({ payload, auth, params }, h) {
    this._validator.validatePostSongToPlaylistSchema(payload)

    const { songId } = payload
    const { playlistId } = params
    const { id: userId } = auth.credentials

    await this._service.verifyPlaylistAccess(playlistId, userId)
    await this._service.addSongToPlaylist(songId, playlistId)
    await this._service.addPlaylistActivities('add', { playlistId, userId, songId })

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    })

    response.code(201)
    return response
  }

  async getSongsFromPlaylistHandler({ params, auth }) {
    const { playlistId } = params
    const { id: credentialId } = auth.credentials

    await this._service.verifyPlaylistAccess(playlistId, credentialId)
    const playlistData = await this._service.getPlaylistMappedById(playlistId)
    const songsData = await this._service.getSongsInPlaylist(playlistId)

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlistData,
          songs: songsData,
        },
      },
    }
  }

  async deleteSongFromPlaylistHandler({ payload, params, auth }) {
    this._validator.validateDeleteSongFromPlaylistSchema(payload)

    const { playlistId } = params
    const { songId } = payload
    const { id: userId } = auth.credentials

    await this._service.verifyPlaylistAccess(playlistId, userId)
    await this._service.deleteSongFromPlaylistBySongId(songId)
    await this._service.addPlaylistActivities('delete', { playlistId, userId, songId })

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    }
  }

  async getPlalistActivitiesHandler({ params, auth }) {
    const { playlistId } = params
    const { id: userId } = auth.credentials

    await this._service.verifyPlaylistAccess(playlistId, userId)
    const activities = await this._service.getHistoryByPlaylistId(playlistId)

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    }
  }
}

module.exports = playlistsHandler