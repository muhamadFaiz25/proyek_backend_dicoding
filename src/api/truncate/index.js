const routes = require('./routes')
const TruncateHandler = require('./handler')

module.exports = {
  name: 'truncate',
  register: (server, { service, validator }) => {
    const truncateHandler = new TruncateHandler(service, validator)
    server.route(routes(truncateHandler))
  },
}