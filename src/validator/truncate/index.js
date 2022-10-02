const InvariantError = require('../../exceptions/InvariantError')
const { TruncatePayloadSchema } = require('./schema')

const TruncateValidator = {
  validatePayload: (payload) => {
    const validationResult = TruncatePayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = TruncateValidator