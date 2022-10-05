const ErrorHandling = require('./handler')

module.exports = {
  name: 'Error handling for pre response',
  version: '1.0.0',
  register: (server) => {
    server.ext('onPreResponse', ErrorHandling.resError)
  },
}