const routes = (handler) => [
  {
    path: '/truncate',
    method: 'DELETE',
    handler: handler.truncateAllTable,
  },
]

module.exports = routes