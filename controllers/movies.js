import {
  validatePartialMovie,
  validateSchema,
} from "../schemas/movieSchema.js";

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }
  getAll = async (req, res) => {
    const { genre } = req.query;
    const movies = await this.movieModel.getAll({ genre });

    res.json(movies);
  };

  getById = async (req, res) => {
    const { id } = req.params;
    const movie = await this.movieModel.getById({ id });
    if (movie) return res.json(movie);

    res.status(404).json({ message: "Movie not found" });
  };

  create = async (req, res) => {
    const result = validateSchema(req.body);

    if (result.error) {
      res.status(400).json({ message: JSON.parse(result.error.message) });
    }

    const newMovie = await this.movieModel.create({ input: result.data });
    res.status(201).json(newMovie);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const result = await this.movieModel.delete({ id });

    if (result === false) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json({ message: "Movie deleted" });
  };

  update = async (req, res) => {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      res.status(400).json({ message: JSON.parse(result.error.message) });
    }

    const updatedMovie = await this.movieModel.patch({
      id,
      input: result.data,
    });

    if (updatedMovie === false) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json(updatedMovie);
  };
}
