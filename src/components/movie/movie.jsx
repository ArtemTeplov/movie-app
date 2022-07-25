import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import './movie.css';

export default class Movie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      originalTitle: props.original_title,
      releaseDate: props.release_date,
      overview: props.overview,
      posterPath: props.poster_path,
    };

    this.shortText = (text) => {
      if (text.length < 200) return text;
      let index = 200;
      for (let i = 199; i < text.length; i++) {
        if (text[i] === ' ') {
          index = i;
          break;
        }
      }
      return `${text.slice(0, index)}...`;
    };
  }

  render() {
    const { originalTitle, releaseDate, overview, posterPath } = this.state;
    const date = format(new Date(releaseDate), 'MMMM d, yyyy');

    return (
      <li className="movie">
        <img src={`https://image.tmdb.org/t/p/w500${posterPath}`} className="movie-poster" alt="movie" />
        <div className="movie-information">
          <h5>{originalTitle}</h5>
          <p className="movie-date">{date}</p>
          <div className="movie-genres">Action Drama</div>
          <p className="movie-description">{this.shortText(overview)}</p>
        </div>
      </li>
    );
  }
}

Movie.propTypes = {
  original_title: PropTypes.string.isRequired,
  release_date: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  poster_path: PropTypes.string.isRequired,
};
