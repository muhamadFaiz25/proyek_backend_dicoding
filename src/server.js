require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert')
const path = require('path')

// error for pre response
const errorPreResponse = require('./api/errors')

// songs
const songs = require('./api/songs')
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/songs')

// albums
const albums = require('./api/albums')
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')

// users
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

// authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const TokenManager = require('./tokenize/tokenManager')
const AuthenticationsValidator = require('./validator/authentications')

// playlists
const playlists = require('./api/playlists')
const PlaylistsService = require('./services/postgres/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')

// colaborations
const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

// exports
const _exports = require('./api/exports')
const ProducerService = require('./services/exports/ProducerService')
const ExportsValidator = require('./validator/exports')

// caching
const CacheControl = require('./services/cache/CacheControl')

// truncates
const truncate = require('./api/truncate')
const truncateValidator = require('./validator/truncate')
const TruncateService = require('./services/postgres/TruncateDBService')

const initServer = async () => {
  const cacheControl = new CacheControl()
  const albumsService = new AlbumsService({ coverUploadFolder: path.resolve(__dirname, process.env.UPLOADS_DIRECTORY), cacheControl })
  const songsService = new SongsService(cacheControl)
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const collaborationsService = new CollaborationsService(cacheControl)
  const playlistsService = new PlaylistsService({ collaborationsService, songsService: new SongsService(), cacheControl })

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ])

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  })

  await server.register([
    {
      plugin: albums,
      options: {
        albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: errorPreResponse,
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        exportsService: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: truncate,
      options: {
        service: TruncateService,
        validator: truncateValidator,
      },
    },
  ])

  server.start()
  console.log(`Server telah berjalan pada ${server.info.uri}`)
}

initServer()