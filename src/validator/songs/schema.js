const joi = require('joi');

const SongPayloadSchema = joi.object({
  title: joi.string().required(),
  year: joi.number().integer().min(1900).max(2021).required(),
  genre: joi.string().required(),
  performer: joi.string().required(),
  duration: joi.number().integer(),
  albumId: joi.string(),
});

module.exports = {SongPayloadSchema};