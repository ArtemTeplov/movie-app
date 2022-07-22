import React from 'react';

import Movie from '../movie';

import './movies.css';

const Movies = ({ movies }) => {
  return (
    <ul className="movies">
      {movies.map((movie) => {
        return <Movie {...movie} key={movie.id} />;
      })}
    </ul>
  );
};

export default Movies;
