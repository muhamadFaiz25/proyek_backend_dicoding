const InvariantError = require("../../exceptions/InvariantError");
const { AlbumsPayloadSchema, UploadImageHeadersSchema } = require('./schema')

const AlbumnsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumsPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateUploadCoverHeadersSchema: (header) => {
    const validationResult = UploadImageHeadersSchema.validate(header)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = AlbumnsValidator