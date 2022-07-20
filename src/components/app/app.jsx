import React from 'react';

import Movies from '../movies';
import './app.css';

export default class App extends React.Component {
  state = {
    movies: [],
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="app">
        <Movies movieList={movies} />
      </div>
    );
  }
}
