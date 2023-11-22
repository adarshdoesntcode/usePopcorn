export function MovieList({ movies, onSetSelectedMovieID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSetSelectedMovieID={onSetSelectedMovieID}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, onSetSelectedMovieID }) {
  return (
    <li key={movie.imdbID} onClick={() => onSetSelectedMovieID(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
