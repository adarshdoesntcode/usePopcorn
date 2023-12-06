import { useEffect, useState } from "react";
import { KEY } from "./App";
import { Loader, ErrorMessage } from "./Utils";
import StarRating from "./StarRating";

export function SelectedMovieDetails({
  selectedMovieID,
  onBackButton,
  onSetWatchedMovie,
  watched,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  const isAlreadyRated = watched
    .map((movie) => movie.imdbID)
    ?.includes(selectedMovieID);

  function handleAddWatchedMovie() {
    const newWatchedMovie = {
      imdbID: selectedMovieID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      Runtime: Number(movie.Runtime.split(" ")[0]),
      userRating,
    };

    onSetWatchedMovie(newWatchedMovie);
    onBackButton();
  }

  useEffect(() => {
    async function getMovieDetails() {
      try {
        setErrorMessage("");
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieID}`
        );

        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();
        setMovie(data);
      } catch (e) {
        setErrorMessage(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedMovieID]);

  useEffect(() => {
    if (!movie.Title) return;
    document.title = movie.Title;

    return () => {
      document.title = "usePopcorn";
    };
  }, [movie.Title]);

  useEffect(() => {
    const callback = (e) => {
      if (e.code === "Escape") onBackButton();
    };

    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [onBackButton]);

  return (
    <div className="details">
      {isLoading && <Loader />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {!isLoading && !errorMessage && (
        <>
          <header>
            <button onClick={onBackButton} className="btn-back">
              &larr;
            </button>
            <img src={movie.Poster} alt={movie.Title}></img>
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isAlreadyRated ? (
                <p>
                  You rated this movie{" "}
                  {
                    watched.filter(
                      (movie) => movie.imdbID === selectedMovieID
                    )[0].userRating
                  }{" "}
                  ⭐️
                </p>
              ) : (
                <StarRating
                  maxRating={10}
                  size={2.5}
                  onSetRating={setUserRating}
                />
              )}

              {userRating > 0 && (
                <button className="btn-add" onClick={handleAddWatchedMovie}>
                  + Add to list
                </button>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
