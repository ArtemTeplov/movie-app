import React, { Component } from 'react';
import { Spin, Alert } from 'antd';

import Movies from '../movies';
import './app.css';
import MovieApi from '../../services';

export default class App extends Component {
  constructor() {
    super();

    this.getMovies = new MovieApi();

    this.state = {
      movies: [],
      loading: true,
      error: false,
    };

    this.catchError = () => {
      this.setState({
        movies: [],
        loading: false,
        error: true,
      });
    };

    this.getMovies
      .searchMovies('return')
      .then((movies) => {
        if (movies instanceof Error) {
          this.catchError();
        } else {
          this.setState({
            movies: movies,
            loading: false,
            error: false,
          });
        }
      })
      .catch(this.catchError());
  }

  render() {
    const { loading, movies, error } = this.state;

    let spinner = null;
    if (loading) {
      spinner = <Spin className="spinner" size="large" />;
    }

    let alert = null;
    if (error) {
      alert = <Alert message="Кажется, что-то пошло не так..." type="error" />;
    }

    let moviesData = null;
    if (!loading && !error) {
      moviesData = <Movies movies={movies} />;
    }

    return (
      <div className="app">
        {spinner}
        {alert}
        {moviesData}
      </div>
    );
  }
}
