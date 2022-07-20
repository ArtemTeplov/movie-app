import React, { Component } from 'react';

import Movie from '../movie';
import MovieApi from '../../services';

import './movies.css';

export default class Movies extends Component {
  getMovies = new MovieApi();

  state = {
    movies: [],
  };

  render() {
    this.getMovies.searchMovies('return').then((body) => {
      this.setState({
        movies: body,
      });
    });

    const { movies } = this.state;

    return (
      <ul className="movies">
        {movies.map((movie) => {
          return <Movie {...movie} key={movie.id} />;
        })}
      </ul>
    );
  }
}
