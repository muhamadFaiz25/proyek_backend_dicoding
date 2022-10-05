const mapDBToModel = ({
  id, title, year, performer, genre, duration, inserted_at, updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
})

const mapAlbumToModel = ({
  id,
  name,
  year,
  cover,
}) => ({
  id,
  name,
  year,
  coverUrl: cover ? `http://${process.env.HOST}:${process.env.PORT}/albums/cover/${cover}` : null,
})

module.exports = { mapDBToModel, mapAlbumToModel }