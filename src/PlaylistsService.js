const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async findAll(playlistId, userId) {
    let query = {
      text: `SELECT p.id, p.name, u.username 
              FROM playlists AS p 
                  INNER JOIN users AS u 
                      ON u.id = p.owner 
                  LEFT JOIN collaborations AS c 
                      ON c.playlist_id = p.id 
              WHERE p.id = $1 
                AND (p.owner = $2 OR c.user_id = $2)`,
      values: [playlistId, userId],
    };

    const playlists = await this._pool.query(query);

    query = {
      text: `SELECT s.id, s.title, s.performer 
              FROM playlist_songs AS ps 
                  INNER JOIN songs AS s 
                      ON s.id = ps.song_id 
              WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const songs = await this._pool.query(query);

    return {
      playlist: playlists.rows,
      songs: songs.rows,
    };
  }
}

module.exports = PlaylistsService;
