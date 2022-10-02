exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      primaryKey: true,
      type: 'VARCHAR(60)',
    },
    playlist_id: {
      type: 'VARCHAR(60)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(60)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(60)',
      notNull: true,
    },
    action: {
      type: 'TEXT',
      notNull: true,
    },
    time: {
      type: 'TEXT',
      notNull: true,
    },
  })

  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id', 'FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.user_id', 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE')
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.song_id', 'FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities')
}