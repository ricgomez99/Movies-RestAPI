import express, { json } from "express";
import { createMovieRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";
import "dotenv/config";

export const createApp = ({ movieModel }) => {
  const app = express();
  const PORT = process.env.PORT ?? 8000;

  // Removes the x-powered-by Response header
  app.disable("x-powered-by");
  // Parse json middleware
  app.use(json());
  app.use(corsMiddleware());

  app.use("/movies", createMovieRouter({ movieModel }));

  app.listen(PORT, () => {
    console.log(`app listening on port: http://localhost:${PORT}`);
  });
};
