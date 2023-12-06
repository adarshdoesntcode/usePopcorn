import { useEffect, useState } from "react";

export function useFetchMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_KEY}&s=${query}`,
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

    // callback();
    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, errorMessage };
}
