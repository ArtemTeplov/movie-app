import React from 'react';
import { Input, Spin, Alert, Pagination, Tabs } from 'antd';
import { debounce } from 'lodash';

import Movies from '../movies';
import MovieAPI from '../../services';
import { MovieApiProvider } from '../movie-api-context';

import 'antd/dist/antd.min.css';
import './app.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      searchString: '',
      movies: [],
      ratedMovies: [],
      totalResults: 0,
      isLoading: false,
      error: false,
      message: '',
    };

    this.handleError = (error) => {
      const { searchString } = this.state;
      this.setState({
        searchString,
        currentPage: 1,
        movies: [],
        totalResults: 0,
        isLoading: false,
        error: true,
        message: error.message,
      });
    };

    this.getRatingById = (id) => {
      const { ratedMovies } = this.state;
      if (ratedMovies.length === 0) {
        return 0;
      }

      const index = ratedMovies.findIndex((movie) => movie.id === id);
      if (index > -1) {
        return ratedMovies[index].id;
      }

      return 0;
    };

    this.search = async (page = 1) => {
      const { movies, searchString } = this.state;
      if (!searchString) {
        // eslint-disable-next-line no-console
        console.log('in search: !searchString', searchString);
        this.setState({
          searchString: '',
          currentPage: page,
          movies: [],
          totalResults: 0,
          isLoading: false,
          error: false,
          message: '',
        });
        return;
      }

      this.setState({
        currentPage: page,
        searchString,
        movies,
        totalResults: 0,
        isLoading: true,
        error: false,
        message: '',
      });

      try {
        const response = await this.movieApi.searchMovies(searchString, page, 'en-US', true);
        const results = await response.results;
        const totalResults = await response.totalResults;
        const moviesWithRating = await results.map((movie) => {
          return {
            ...movie,
            rating: this.getRatingById(movie.id),
          };
        });

        if (totalResults === 0) {
          if (page > 1) {
            this.setState({
              movies: [],
              searchString,
              currentPage: page,
              totalResults: 0,
              isLoading: false,
              error: false,
              message: '',
            });
          } else {
            this.setState({
              movies: [],
              searchString,
              currentPage: page,
              totalResults,
              isLoading: false,
              error: true,
              message: 'Фильмов, соответствующих поиску, не найдено',
            });
          }
        } else {
          this.setState({
            movies: moviesWithRating,
            searchString,
            currentPage: page,
            totalResults,
            isLoading: false,
            error: false,
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    };

    this.componentDidMount = async () => {
      this.movieApi = new MovieAPI();

      this.debouncedSearch = debounce(this.search, 500);
      const allMovieGenresObject = await this.movieApi.getAllGenres();
      this.allMovieGenres = await allMovieGenresObject.genres;
    };

    this.componentDidUpdate = () => {};

    this.onSearchStringChange = (event) => {
      if (!event) {
        return;
      }

      this.setState({
        currentPage: 1,
        searchString: event.currentTarget.value,
        totalResults: 0,
      });

      this.debouncedSearch();
    };

    this.getRatedMovies = async (page = 1) => {
      const rated = await this.movieApi.getRatedMovies(page);
      const ratedPage = await rated.page;
      // if (ratedPage > totalPages) {
      //   ratedPage = totalPages;
      // }
      const ratedMovies = await rated.results;
      const ratedCount = await rated.total_results;
      this.setState({
        ratedMovies,
        ratedCount,
        ratedPage,
      });
    };

    this.findIndexByID = (array, id) => {
      if (typeof array === 'undefined') {
        return null;
      }
      return array.findIndex((movie) => movie.id === id);
    };

    this.changeRating = (value, index, moviesPropertyName) => {
      this.setState((state) => {
        const modifiedMovie = {
          ...state[moviesPropertyName][index],
          rating: value,
        };

        const modifieMovies = [
          ...state[moviesPropertyName].slice(0, index),
          modifiedMovie,
          ...state[moviesPropertyName].slice(index + 1),
        ];

        return {
          [moviesPropertyName]: modifieMovies,
        };
      });
    };

    this.getMovieById = (id) => {
      const { movies } = this.state;
      const index = this.findIndexByID(movies, id);

      return movies[index];
    };

    this.addRatedMovie = (value, id) => {
      const newRatedMovie = this.getMovieById(id);
      newRatedMovie.rating = value;

      this.setState((state) => {
        const newRatedMovies = [...state.ratedMovies, newRatedMovie];

        return {
          ratedMovies: newRatedMovies,
        };
      });
    };

    this.handleRate = (value, id) => {
      this.movieApi.rate(value, id);
      const { ratedMovies, movies } = this.state;
      const index = this.findIndexByID(ratedMovies, id);

      if (index === null || index === -1) {
        this.addRatedMovie(value, id);
      } else {
        this.changeRating(value, index, 'ratedMovies');
        const indexInMovies = this.findIndexByID(movies, id);
        this.changeRating(value, indexInMovies, 'movies');
      }
    };
  }

  render() {
    const {
      error,
      isLoading,
      message,
      movies,
      searchString,
      currentPage,
      totalResults,
      ratedMovies,
      ratedCount,
      ratedPage,
    } = this.state;

    const spinner = isLoading ? <Spin /> : null;
    const alert = error ? <Alert message={message} type="error" /> : null;
    const hasData = !(isLoading || error || movies === []);
    const didSearch = isLoading || error || movies !== [];
    const data = hasData && didSearch ? <Movies movies={movies} onRate={this.handleRate} /> : null;

    const ratedData = <Movies onRate={this.handleRate} movies={ratedMovies} />;
    const { TabPane } = Tabs;

    return (
      <div className="app">
        <MovieApiProvider value={this.allMovieGenres}>
          <Tabs defaultActiveKey="1" className="center-layout">
            <TabPane tab="Search" key="1" className="center-layout">
              {/* <div className="search-container"> */}
              <Input.Search
                placeholder="Type to search…"
                size="small"
                onChange={this.onSearchStringChange}
                value={searchString}
                className="search-bar"
              />
              {/* </div> */}
              {spinner}
              {alert}
              {data}
              <Pagination
                current={currentPage}
                pageSize={20}
                responsive
                onChange={this.search}
                total={totalResults}
                showSizeChanger={false}
              />
            </TabPane>
            <TabPane tab="Rated" key="2" className="center-layout">
              {ratedData}
              <Pagination
                current={ratedPage}
                pageSize={20}
                responsive
                onChange={this.getRatedMovies}
                total={ratedCount}
                showSizeChanger={false}
              />
            </TabPane>
          </Tabs>
        </MovieApiProvider>
      </div>
    );
  }
}
