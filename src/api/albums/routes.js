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
]

module.exports = routes