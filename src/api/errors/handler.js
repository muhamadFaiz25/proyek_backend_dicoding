const ClientError = require('../../exceptions/ClientError')

const ErrorPreResponse = {
  resError({ response }, h) {
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        })

        newResponse.code(response.statusCode)
        return newResponse
      }
      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server.',
      })

      newResponse.code(500)
      return newResponse
    }

    return h.continue || response
  },
}

module.exports = ErrorPreResponse