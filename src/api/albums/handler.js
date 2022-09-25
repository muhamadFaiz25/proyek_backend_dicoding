const ClientError = require("../../exceptions/ClientError");

class AlbumsHandler{
  constructor(albumsService, songsService, validator){
    this._albumsService = albumsService
    this._songsService = songsService
    this._validator = validator

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler({payload},h){
    try{
      await this._validator.validateAlbumPayload(payload);
      const {name='untitled',year} = payload;
  
      const albumId = await this._albumsService.addAlbum({name,year});
  
      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        }
      });
      response.code(201);
      return response;
    }catch(error){
      if(error instanceof ClientError){
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumByIdHandler({params},h){
    try{
      const {id} = params;
      const album = await this._albumsService.getAlbumById(id);
      const songs = await this._songsService.getSongsByAlbumId(id);
      return {
        status: 'success',
        data: {
          album:{
            ...album,
            songs,
          }
        },
      }
    }catch(error){
      if(error instanceof ClientError){
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAlbumByIdHandler({payload,params},h){
    try{
      await this._validator.validateAlbumPayload(payload);
      const {id} = params;
      await this._albumsService.editAlbumById(id,payload);
  
      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      };
    }catch(error){
      if(error instanceof ClientError){
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAlbumByIdHandler({params},h){
    try{
      const {id} = params;
      await this._albumsService.deleteAlbumById(id);
  
      return {
        status: 'success',
        message: 'Catatan berhasil dihapus',
      }
    }catch(error){
      if(error instanceof ClientError){
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AlbumsHandler;