import React, { Component } from 'react';
import { Spin, Alert, Pagination, Input } from 'antd';
import { debounce } from 'lodash';

import Movies from '../movies';
import './app.css';
import MovieApi from '../../services';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      movies: [],
      loading: true,
      error: false,
      searchString: '',
      currentPage: 1,
      message: '',
    };

    this.catchError = () => {
      this.setState({
        movies: [],
        loading: false,
        error: true,
      });
    };

    this.search = (page = 1) => {
      const { searchString, movies } = this.state;

      if (typeof searchString === 'undefined') {
        return;
      }
      if (searchString === 0) {
        this.setState({
          searchString,
          currentPage: page,
        });
      } else {
        this.setState({
          movies,
          loading: true,
          error: false,
          searchString,
          currentPage: page,
          message: '',
        });

        this.getMovies
          .searchMovies(searchString, page)
          .then((movies) => {
            if (movies.length === 0 && searchString.length > 0) {
              if (page > 1) {
                this.setState({
                  movies: [],
                  loading: false,
                  error: false,
                  searchString,
                  currentPage: page,
                  message: '',
                });
              } else {
                this.setState({
                  movies: movies,
                  searchString,
                  currentPage: page,
                  loading: false,
                  error: true,
                  message: 'Фильмов, соотвтетствующих запросу, не найдено',
                });
              }
            } else {
              this.setState({
                movies: movies,
                searchString,
                currentPage: page,
                loading: false,
                error: false,
              });
            }
          })
          .catch(this.catchError);
      }
    };

    this.componentDidMount = () => {
      this.getMovies = new MovieApi();
      this.debouncedSearch = debounce(this.search, 500);
    };

    this.componentDidUpdate = () => {};

    this.onChange = (e) => {
      const { movies } = this.state;
      if (!e) {
        return;
      }
      this.setState({
        movies,
        loading: true,
        searchString: e.currentTarget.value,
        currentPage: 1,
      });

      this.debouncedSearch();
    };
  }

  render() {
    const { loading, movies, error, searchString, currentPage, message } = this.state;

    let spinner = null;
    if (loading) {
      spinner = <Spin className="spinner" size="large" />;
    }

    let alert = null;
    if (error) {
      alert = (
        <div className="alert">
          <Alert message={message} type="error" />
        </div>
      );
    }

    let moviesData = null;
    if (!loading && !error) {
      moviesData = <Movies movies={movies} />;
    }

    return (
      <div className="app">
        <div className="searchInput">
          <Input size="large" placeholder="Type to search…" onChange={this.onChange} value={searchString} />
        </div>
        {spinner}
        {alert}
        {moviesData}
        <div className="pagination">
          <Pagination current={currentPage} pageSize={10} responsive onChange={this.search} total={50} />
        </div>
      </div>
    );
  }
}
