const path = require('path')

const routes = (handler) => [
  {
    path: '/albums',
    method: 'POST',
    handler: handler.postAlbum,
  },
  {
    path: '/albums/{id}',
    method: 'GET',
    handler: handler.getAlbumById,
  },
  {
    path: '/albums/{id}',
    method: 'PUT',
    handler: handler.putAlbumById,
  },
  {
    path: '/albums/{id}',
    method: 'DELETE',
    handler: handler.deleteAlbumById,
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postAlbumCoverHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        parse: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/cover/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../../storage/album'),
      },
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postAlbumLikeHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getAlbumLikesHandler,
  },
]

module.exports = routes