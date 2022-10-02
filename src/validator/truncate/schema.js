const Joi = require('joi')

const TruncatePayloadSchema = Joi.object({
  token: Joi.string().required(),
})

module.exports = { TruncatePayloadSchema }