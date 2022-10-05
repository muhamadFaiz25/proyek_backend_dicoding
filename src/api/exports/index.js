const routes = require('./routes')
const ExportSongsHandler = require('./handler')

module.exports = {
  name: 'Export Songs',
  version: '1.0.0',
  register: (server, {
    exportsService, playlistsService, validator,
  }) => {
    const exportSongsHandler = new ExportSongsHandler({
      exportsService, playlistsService, validator,
    })

    server.route(routes(exportSongsHandler))
  },
}