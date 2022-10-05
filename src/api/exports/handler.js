class ExportSongsHandler {
  constructor({ exportsService, playlistsService, validator }) {
    this._exportsService = exportsService
    this._playlistsService = playlistsService
    this._validator = validator

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this)
  }

  async postExportSongsHandler({ payload, auth, params }, h) {
    this._validator.validateExportSongsPayload(payload)

    const { playlistId } = params
    const { id: userId } = auth.credentials

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId)

    const message = {
      playlistId,
      targetEmail: payload.targetEmail,
    }

    await this._exportsService.sendMessage('export:playlists', JSON.stringify(message))

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    })

    response.code(201)
    return response
  }
}

module.exports = ExportSongsHandler