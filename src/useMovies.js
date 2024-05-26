import { useEffect, useState } from "react";

const KEY = "d0ec1fff&s";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function fetching() {
      let currError = "An Unkown Error Ocuured";
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(
          `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query
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

  return { movies, error, isLoading };
}
