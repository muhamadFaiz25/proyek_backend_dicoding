const Joi = require('joi')

const postCollaborationSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
})

const deleteCollaborationSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
})

module.exports = { postCollaborationSchema, deleteCollaborationSchema }