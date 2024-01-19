import { createApp } from "../app.js";
import request from "supertest";
import { MovieModel } from "../models/mysql/movie.js";
import { randomUUID } from "node:crypto";

const app = createApp({ movieModel: MovieModel });
const postMock = {
  title: "Test Movie",
  year: 2023,
  director: "supertest",
  duration: 140,
  poster: "",
  rate: 8.1,
  genre: ["Action", "Crime", "Romance"],
  id: randomUUID(),
};

let movieId;

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
  it("should return a json containing a single movie", (done) => {
    request(app)
      .get("/movies/254b8096-b6fc-11ee-92b7-b6ca7bc4c828")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("should get 'Movie not found' message, if movie doesn't exist", (done) => {
    request(app)
      .get("/movies/c3ede094-93b7-11ee-9439-ceb4afa55211")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect({ message: "Movie not found" })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /movies", () => {
  it("should return a json containing the movie created", (done) => {
    request(app)
      .post("/movies")
      .send(postMock)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        movieId = res.body.id;
        expect(movieId).toBeDefined();
        done();
      });
  });
});

describe("DELETE /movies/:id", () => {
  it("should delete the movie with the provided id", (done) => {
    console.log(`Deleting movie with id: ${movieId}`);
    expect(movieId).toBeDefined();
    request(app)
      .delete(`/movies/${movieId}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect({ message: "Movie deleted" })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("should get 'Movie not found' message, if movie doesn't exist", (done) => {
    request(app)
      .delete("/movies/c3ede094-93b7-11ee-9439-ceb4afa53455")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect({ message: "Movie not found" })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("PATCH /movies/:id", () => {
  it("should update the property/ties provided, year = 2020 & rate = 6.1", (done) => {
    const data = {
      year: 2020,
      rate: 6.1,
    };
    request(app)
      .patch("/movies/cd4d6ad8-a416-11ee-9c4e-5ace26a46e00")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body.year = 2020;
        res.body.rate = "6.1";
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("should update title and duration properties: title = 'Dross picture' duration = 150", (done) => {
    const data = {
      title: "Dross picture",
      duration: 150,
    };

    request(app)
      .patch("/movies/cd4d6ad8-a416-11ee-9c4e-5ace26a46e00")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body.title = "Dross picture";
        res.body.duration = 150;
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
