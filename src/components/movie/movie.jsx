import React from 'react';
import PropTypes from 'prop-types';

import './movie.css';

import MovieHeader from '../movie-header';
import MovieFooter from '../movie-footer';

export default class Movie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      overview: props.overview,
      posterPath: props.poster_path,
      rating: props.rating,
      genreIds: props.genre_ids,
      originalTitle: props.original_title,
      voteAverage: props.vote_average,
      releaseDate: props.release_date,
      layout: '',
    };

    this.truncateDescription = (description) => {
      if (typeof description === 'undefined') {
        return '';
      }
      const indexOfSpaceAfterTruncate = description.indexOf(' ', 200);
      return description.slice(0, indexOfSpaceAfterTruncate).concat('…');
    };

    this.handleResize = () => {
      const { layout } = this.state;
      if (window.innerWidth > 1000 && layout !== 'desktop') {
        this.setState({
          layout: 'desktop',
        });
      } else if (window.innerWidth <= 1000 && layout !== 'mobile') {
        this.setState({
          layout: 'mobile',
        });
      }
    };

    this.componentDidUpdate = (prevProps) => {
      const { rating } = this.props;
      if (rating !== prevProps.rating) {
        this.setState({
          rating,
        });
      }
    };

    this.componentDidMount = () => {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    };

    this.componentWillUnmount = () => {
      window.removeEventListener('resize', this.handleResize);
    };
  }

  render() {
    const { overview, posterPath, rating, genreIds, voteAverage, releaseDate, originalTitle, layout } = this.state;

    const { id, onRate } = this.props;

    const imageSrc = posterPath === null ? '' : `https://image.tmdb.org/t/p/w500${posterPath}`;

    const desktopLayout = (
      <li className="movie-container">
        <img alt="poster" src={imageSrc} className="movie-img" />
        <div className="movie-desktop-layout">
          {' '}
          <MovieHeader
            genreIds={genreIds}
            voteAverage={voteAverage}
            releaseDate={releaseDate}
            originalTitle={originalTitle}
          />
          <MovieFooter overview={overview} rating={rating} id={id} onRate={onRate} />
        </div>
      </li>
    );

    const mobileLayout = (
      <li className="movie-container">
        <div className="movie-mobile-layout">
          {' '}
          <img alt="poster" src={imageSrc} className="movie-img" />
          <MovieHeader
            genreIds={genreIds}
            voteAverage={voteAverage}
            releaseDate={releaseDate}
            originalTitle={originalTitle}
          />
        </div>
        <MovieFooter overview={overview} rating={rating} id={id} onRate={onRate} />
      </li>
    );

    const layoutContainer = layout === 'desktop' ? desktopLayout : mobileLayout;

    // eslint-disable-next-line no-console
    console.log('layout', layout);

    return (
      // desktopLayout
      // mobileLayout
      layoutContainer
    );
  }
}

Movie.defaultProps = {
  poster_path: null,
  release_date: '',
  rating: 0,
  vote_average: 0,
  genre_ids: [],
};

Movie.propTypes = {
  original_title: PropTypes.string.isRequired,
  release_date: PropTypes.string,
  overview: PropTypes.string.isRequired,
  poster_path: PropTypes.string,
  id: PropTypes.number.isRequired,
  rating: PropTypes.number,
  vote_average: PropTypes.number,
  genre_ids: PropTypes.arrayOf(PropTypes.number),
  onRate: PropTypes.func.isRequired,
};
