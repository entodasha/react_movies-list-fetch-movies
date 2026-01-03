import { useMemo, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { getMovie } from './api';

export const App = () => {
  const [movies] = useState<Movie[]>([]);

  const [query, setQuery] = useState<string>('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [visibleMovies, setVisibleMovies] = useState<Movie[]>(movies);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(false);
  };

  const handleSubmit = useMemo(() => {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setIsLoading(true);

      if (query) {
        getMovie(query)
          .then(result => {
            if ('Error' in result && result.Response === 'False') {
              setError(true);
              setMovieData(null);
            } else {
              setMovieData(result as MovieData);
            }
          })
          .catch(() => {
            setError(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };
  }, [query]);

  const addMovie = useMemo(() => {
    return (newMovie: Movie) => {
      if (movies.find(movie => movie.imdbId === newMovie.imdbId)) {
        setQuery('');
        setMovieData(null);

        return;
      }

      movies.push(newMovie);

      setVisibleMovies([...visibleMovies, newMovie]);

      setQuery('');
      setMovieData(null);
    };
  }, [movies, visibleMovies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onInputChange={handleQueryChange}
          onSubmit={handleSubmit}
          query={query}
          isError={error}
          isLoading={isLoading}
          movieData={movieData}
          onAdd={addMovie}
        />
      </div>
    </div>
  );
};
