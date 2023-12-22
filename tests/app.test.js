import { createApp } from "../app.js";
import request from "supertest";
import { MovieModel } from "../models/mysql/movie.js";

const app = createApp({ movieModel: MovieModel });

describe("GET /movies", () => {
  it("should return a json containing a list of movies", (done) => {
    request(app)
      .get("/movies")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("GET /movies/:id", () => {
  it("should return a json containing a single user", (done) => {
    request(app)
      .get("/movies/b909639c-93b4-11ee-9439-ceb4afa73033")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
