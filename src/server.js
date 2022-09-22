require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs')
const albums = require('./api/albums')

// service & validator
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/songs')
const AlbumsValidator = require('./validator/albums')
const AlbumsService = require('./services/postgres/AlbumsService')
 
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      }
    }
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumsService: new AlbumsService(),
        songsService: new SongsService(),
        validator: AlbumsValidator,
      }
    },
    {
      plugin: songs,
      options: {
        service: new SongsService(),
        validator: SongsValidator,
      },
    }
  ])
  
 
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
}
 
init();