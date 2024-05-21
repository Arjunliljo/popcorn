import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "d0ec1fff&s";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(() => {
    const oldWatched = localStorage.getItem("watched");
    return JSON.parse(oldWatched);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedId, setSelectedId] = useState("");

  const isMobile = window.innerWidth <= 768;

  const [isWishlist, setIsWishlist] = useState(!isMobile);

  const handleMovieSelect = (id) => {
    setSelectedId(id);
    setIsWishlist(true);
  };

  const handleCloseMovie = () => {
    setSelectedId("");
    setIsWishlist(false);
  };
  const handleWishListBtn = () => {
    setIsWishlist((isWishlist) => !isWishlist);
  };

  // const handleResize = () => {
  //   setIsMobile(window.innerWidth <= 768);
  //   setIsWishlist(!(window.innerWidth <= 768));
  // };

  const handleRemove = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  const handleAddMovie = (movie, userRating) => {
    const newWatchedMovie = { ...movie, userRating };

    setWatched((watchedList) => {
      return [...watchedList, newWatchedMovie];
    });
  };
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function fetching() {
      let currError = "An Unkown Error Ocuured";
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(
          `https://www.omdbapi.com/?i=tt3896198&apikey=d0ec1fff&s=${query
            .replaceAll(" ", `%20`)
            .trim()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          currError = "Somthing Went wrong while fetching";
          throw new Error();
        }

        const data = await response.json();

        if (data.Response === "False") {
          currError = "Movie Not Found";
          throw new Error();
        }
        setError("");
        setMovies(data.Search);
      } catch (error) {
        if (error.name !== "AbortError") setError(currError);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setError("Search For Movies...");
      setMovies([]);
      return;
    }

    fetching();

    return () => controller.abort();
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </NavBar>

      <Main>
        {!isMobile && (
          <>
            <Box>
              {isLoading && <Loader />}
              {!isLoading && !error && (
                <MovieList movies={movies} onSelectMovie={handleMovieSelect} />
              )}
              {error && <Error message={error} />}
            </Box>

            <Box>
              {selectedId ? (
                <MovieDetails
                  selectedId={selectedId}
                  onCloseMovie={handleCloseMovie}
                  onSetWatchedMovie={handleAddMovie}
                  watched={watched}
                  key={selectedId}
                />
              ) : (
                <>
                  <WatchedSummery watched={watched} />
                  <WatchedList
                    watched={watched}
                    handleRemove={handleRemove}
                    movieSelect={handleMovieSelect}
                  />
                </>
              )}
            </Box>
          </>
        )}
        {isMobile && !isWishlist && (
          <Box>
            {isLoading && <Loader />}
            {!isLoading && !error && (
              <MovieList movies={movies} onSelectMovie={handleMovieSelect} />
            )}
            {error && <Error message={error} />}
          </Box>
        )}
        {isMobile && isWishlist && (
          <Box>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onSetWatchedMovie={handleAddMovie}
                watched={watched}
                key={selectedId}
                isMobile={isMobile}
              />
            ) : (
              <>
                <WatchedSummery watched={watched} />
                <WatchedList
                  watched={watched}
                  handleRemove={handleRemove}
                  movieSelect={handleMovieSelect}
                />
              </>
            )}
          </Box>
        )}
        {!selectedId && (
          <WishListButton
            isWishlist={isWishlist}
            onSetWishlistBtn={handleWishListBtn}
          />
        )}
      </Main>
    </>
  );
}
function Error({ message }) {
  return <p className="error">{message}</p>;
}
function Loader() {
  return <p className="loader">Loading...</p>;
}
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Popcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(() => {
    const callback = (e) => {
      if (e.key !== "Enter") return;

      inputEl.current.focus();
      if (inputEl.current.value) setQuery("");
    };

    document.addEventListener("keydown", callback);

    return () => document.removeEventListener("keydown", callback);
  }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
      }}
      ref={inputEl}
    />
  );
}
function Results({ movies = [] }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
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

function MovieDetails({
  selectedId,
  onCloseMovie,
  onSetWatchedMovie,
  watched,
  isMobile,
}) {
  const [movie, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  useEffect(() => {
    const callback = (e) => {
      if (e.key === "Escape") onCloseMovie();
      console.log(e.key);
    };
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [onCloseMovie]);

  useEffect(() => {
    const getMovieDetails = async () => {
      setIsLoading(true);
      const response = await fetch(
        `https://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`
      );
      const data = await response.json();
      setMovieDetails(data);
      setIsLoading(false);
    };
    getMovieDetails();
  }, [selectedId]);

  let isExist = watched?.some((curMovie) => curMovie.imdbID === movie.imdbID);

  const handleAdd = (movie) => {
    if (isExist) return;
    if (!userRating) return;
    isExist = true;
    onSetWatchedMovie(movie, userRating);
  };

  const handleRemove = (movie) => {
    onSetWatchedMovie((watchedList) =>
      watchedList.filter((curMovie) => curMovie.imdbID !== movie.imdbID)
    );
    isExist = false;
  };

  useEffect(() => {
    if (!movie.Title) return;
    document.title = `Movie | ${movie.Title}`;

    // cleanup function
    return () => (document.title = "Popcorn");
  }, [movie]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <img src={movie.Poster} alt="movie poster"></img>
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>{movie.Released}</p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} Imdb rating
              </p>
            </div>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
          </header>
          <section>
            <div className="rating">
              {!isExist && (
                <StarRating
                  maxLength="10"
                  size={isMobile ? "16" : "24"}
                  onSetRating={setUserRating}
                />
              )}

              <button
                onClick={() =>
                  isExist ? handleRemove(movie) : handleAdd(movie)
                }
                className="btn-add"
              >
                {isExist ? "Remove From WatchedList" : "+ Add to WatchedList"}
              </button>
            </div>

            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>ACTORS : {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(
    watched.map((movie) => Number(movie?.Runtime?.split(" ")?.at(0)))
  );

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length ? watched.length : 0} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, handleRemove, movieSelect }) {
  if (!watched) return;
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          handleRemove={handleRemove}
          movieSelect={movieSelect}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, handleRemove, movieSelect }) {
  return (
    <li>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        onClick={() => movieSelect(movie.imdbID)}
      />
      <h3 onClick={() => movieSelect(movie.imdbID)}>{movie.Title}</h3>
      <div onClick={() => movieSelect(movie.imdbID)}>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating ? movie.userRating : 0}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime}</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => {
          handleRemove(movie.imdbID);
          movieSelect("");
        }}
      >
        X
      </button>
    </li>
  );
}

function WishListButton({ isWishlist, onSetWishlistBtn }) {
  return (
    <button onClick={onSetWishlistBtn} className="btn-wishlist">
      {isWishlist ? "Close" : "Wish List"}
    </button>
  );
}
