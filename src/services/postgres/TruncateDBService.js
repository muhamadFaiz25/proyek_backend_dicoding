const pg = require('pg')

const TruncateService = {
  truncateDB: async () => {
    const pool = new pg.Pool()
    await pool.query('TRUNCATE songs, albums, playlistsongs, authentications, users, playlists, collaborations, playlist_song_activities, user_album_likes')
  },
}

module.exports = TruncateService