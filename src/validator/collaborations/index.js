const {
  postCollaborationSchema, deleteCollaborationSchema,
} = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const collaborationValidator = {
  validatePostCollaborationSchema: (payload) => {
    const validationResult = postCollaborationSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateDeleteCollaborationSchema: (payload) => {
    const validationResult = deleteCollaborationSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = collaborationValidator