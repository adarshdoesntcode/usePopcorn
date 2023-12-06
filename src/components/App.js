import { useEffect, useState } from "react";

import { Loader, ErrorMessage } from "./Utils";
import { NavBar, Logo, Search, NumResults } from "./NavBar";
import { Main, Box } from "./Main";
import { MovieList } from "./MovieList";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedMovieList } from "./WatchedMovieList";
import { SelectedMovieDetails } from "./SelectedMovieDetails";

export const KEY = "a10a24ff";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMovieID, setSelectedMovieID] = useState(null);

  function handleSetSelectedID(id) {
    setSelectedMovieID((prev) => (prev === id ? null : id));
  }

  function handleClearSelected() {
    setSelectedMovieID(null);
  }

  function handleSetWatched(movie) {
    setWatched((prev) =>
      prev.find((mov) => mov.imdbID === movie.imdbID)
        ? [...prev]
        : [...prev, movie]
    );
  }

  function removeWatchedMovie(movie) {
    setWatched((prev) => prev.filter((mov) => mov.imdbID !== movie.imdbID));
  }

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          {
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie Not Found");

        setMovies(data.Search);
        setErrorMessage("");
      } catch (e) {
        if (e.name !== "AbortError") setErrorMessage(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length === 0) {
      setErrorMessage("");
      setMovies([]);
      return;
    }
    handleClearSelected();
    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {errorMessage && <ErrorMessage message={errorMessage} />}
          {!isLoading && !errorMessage && (
            <MovieList
              movies={movies}
              onSetSelectedMovieID={handleSetSelectedID}
            />
          )}
        </Box>
        <Box>
          {selectedMovieID ? (
            <SelectedMovieDetails
              selectedMovieID={selectedMovieID}
              onBackButton={handleClearSelected}
              onSetWatchedMovie={handleSetWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onRemoveWatchedMovie={removeWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
