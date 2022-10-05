const Joi = require('joi')

const ExportSongsSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
})

module.exports = { ExportSongsSchema }