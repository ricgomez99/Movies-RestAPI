import { createApp } from "./app.js";
import { MovieModel } from "./models/mysql/movie.js";

// Now we can create separe servers and use the model we prefer,
// Injecting the specific model from the greater file (Useed Dependency Injection);
createApp({ movieModel: MovieModel });
