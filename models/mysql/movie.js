// Use mysql2 dependecy -> npm i mysql2
import mysql from "mysql2/promise";
import "dotenv/config";

// Connection setup

const DEFAULT_CONFIG = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "moviesdb",
};

const config = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();

      const [genres] = await connection.query(
        "SELECT id, name FROM genre WHERE LOWER(name) = ?",
        [lowerCaseGenre]
      );

      if (genres.length === 0) {
        return [];
      }

      const [{ id }] = genres;
      const [results] = await connection.query(
        `SELECT m.title, m.year, m.director, m.duration, m.poster, m.rate, BIN_TO_UUID(m.id) as id 
        FROM movie m 
        JOIN movie_genres mg ON m.id = mg.movie_id
        WHERE mg.genre_id = ?`,
        [id]
      );

      return results;
    }

    const [movies] = await connection.query(
      `SELECT m.title, m.year, m.director, m.duration, m.poster, m.rate, 
       BIN_TO_UUID(m.id) AS id, 
       (SELECT GROUP_CONCAT(g.name) FROM genre g 
       JOIN movie_genres mg ON mg.genre_id = g.id
       WHERE mg.movie_id = m.id) AS genres 
       FROM movie m;`
    );

    return movies;
  }

  static async getById({ id }) {
    const [movie] = await connection.query(
      `SELECT title, year, director, duration, poster, rate,
     BIN_TO_UUID(id) id FROM movie
     WHERE id = UUID_TO_BIN(?);`,
      [id]
    );

    if (movie.length === 0) return null;

    return movie[0];
  }

  static async create({ input }) {
    const {
      genre: genreInputs,
      title,
      year,
      director,
      duration,
      poster,
      rate,
    } = input;

    const [uuidResult] = await connection.query("SELECT UUID() uuid");
    const [{ uuid }] = uuidResult;

    try {
      const [insertResult] = await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
         VALUES(UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      );

      const movieId = insertResult.insertId || uuid;
      const genreIds = [];

      for (const genreInput of genreInputs) {
        const [genreIdResult] = await connection.query(
          `SELECT id FROM genre WHERE name = ?`,
          [genreInput]
        );

        if (genreIdResult.length === 0) {
          throw new Error(`Genre ${genreIdResult} Does not exist`);
        }

        const [{ id: genre_id }] = genreIdResult;
        genreIds.push(genre_id);
      }

      for (const genre_id of genreIds) {
        await connection.query(
          `INSERT INTO movie_genres (movie_id, genre_id)
           VALUES (UUID_TO_BIN(?), ?);`,
          [movieId, genre_id]
        );
      }
    } catch (error) {
      throw new Error(`Error creating a new movie, error: ${error}`);
    }

    const [movie] = await connection.query(
      `SELECT title, year, director, duration, poster, rate,
      BIN_TO_UUID(id) id FROM movie
      WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    );

    return movie;
  }

  static async delete({ id }) {
    const [movie] = await connection.query(
      `DELETE FROM movie WHERE id = UUID_TO_BIN(?)`,
      [id]
    );

    if (movie.length === 0) {
      return false;
    }
  }

  static async patch({ id, input }) {
    const { title, year, director, duration, poster, rate } = input;

    const fieldToUpdate = {};

    // Use switch true and verify that every case is not undefined
    // To avoid update the information that was not required or passed through the body

    switch (true) {
      case title !== undefined:
        fieldToUpdate.title = title;
        break;
      case year !== undefined:
        fieldToUpdate.year = year;
        break;
      case director !== undefined:
        fieldToUpdate.director = director;
        break;
      case duration !== undefined:
        fieldToUpdate.duration = duration;
        break;
      case poster !== undefined:
        fieldToUpdate.poster = poster;
        break;
      case rate !== undefined:
        fieldToUpdate.rate = rate;
        break;
    }

    const [movie] = await connection.query(
      `UPDATE movie SET ? WHERE id = UUID_TO_BIN(?);`,
      [fieldToUpdate, id]
    );

    if (movie.length === 0) {
      return false;
    }

    return movie;
  }
}
