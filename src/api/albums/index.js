const routes = require('./routes')
const AlbumsHandler = require('./handler')

module.exports = {
  name: 'albums',
  version: '1.0',
  register: (server, {
    albumsService,
    validator,
  }) => {
    const albumsHandler = new AlbumsHandler({
      albumsService,
      validator,
    })

    server.route(routes(albumsHandler))
  },
}