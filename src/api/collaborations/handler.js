class collaborationsHandler {
  constructor({
    collaborationsService, playlistsService, usersService, validator,
  }) {
    this._collaborationsService = collaborationsService
    this._playlistsService = playlistsService
    this._usersServices = usersService
    this._validator = validator

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this)
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)
  }

  async postCollaborationHandler({ payload, auth }, h) {
    this._validator.validatePostCollaborationSchema(payload)

    const { id: credentialId } = auth.credentials
    const { playlistId, userId } = payload

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._usersServices.verifyExistingUserWithUserId(userId)
    const id = await this._collaborationsService.addCollaboration(playlistId, userId)

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId: id,
      },
    })

    response.code(201)
    return response
  }

  async deleteCollaborationHandler({ payload, auth }) {
    this._validator.validateDeleteCollaborationSchema(payload)

    const { id: credentialId } = auth.credentials
    const { playlistId, userId } = payload

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._collaborationsService.deleteCollaboration(playlistId, userId)

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    }
  }
}

module.exports = collaborationsHandler