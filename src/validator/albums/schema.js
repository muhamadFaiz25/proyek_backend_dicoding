const joi = require('joi');

const AlbumPayloadSchema = joi.object({
  name: joi.string().required(),
  year: joi.number().integer().required(),
});

module.exports = {AlbumPayloadSchema};