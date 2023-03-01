const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//GET all movies List
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT 
        movie_name
    FROM
     movie
    ORDER BY 
     movie_id;`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = ` SELECT * FROM movie WHERE movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});

//Adding a New Movie
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { director_id, movie_name, lead_actor } = movieDetails;
  const addMovieQuery = `
    INSERT INTO
      movie (director_id,
    movie_name,
    lead_actor)
    VALUES(
        '${directorId}',
         ${movieName},
         ${leadActor},`;
  const movie = await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

//Update movie details
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
    UPDATE
      movie
    SET
      director_id='${directorId}',
      movie_name=${movieName},
      leadActor=${leadActor}
      WHERE
      movie_id = ${movieId};`;
  await db.run(updateBookQuery);
  response.send("Movie Details Updated");
});

//Delete Movie
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM
     movie
    WHERE
     movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

app.get("/directors/",(request,response) => {
    const getDirectorQuery = `
    SELECT
    *
    FROM 
    director;`;
    const directorsArray = await db.all(getDirectorQuery);
  response.send(directorsArray);
})

app.get("/directors/:directorId/books", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMoviesQuery = `
    SELECT
    *
    FROM
        director
    WHERE
        director_id = ${directorId};`;
  const moviesArray = await db.all(getDirectorMoviesQuery);
  response.send(moviesArray);
});

module.exports = app;
