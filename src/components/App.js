import { useState } from "react";

import { Loader, ErrorMessage } from "./Utils";
import { NavBar, Logo, Search, NumResults } from "./NavBar";
import { Main, Box } from "./Main";
import { MovieList } from "./MovieList";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedMovieList } from "./WatchedMovieList";
import { SelectedMovieDetails } from "./SelectedMovieDetails";
import { useFetchMovie } from "./customHooks/useFetchMovie";
import { useLocalStorageState } from "./customHooks/useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");

  const [selectedMovieID, setSelectedMovieID] = useState(null);

  const { movies, isLoading, errorMessage } = useFetchMovie(query);
  const [watched, setWatched] = useLocalStorageState("watched");

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
