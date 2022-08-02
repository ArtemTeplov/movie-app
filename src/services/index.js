export default class MovieAPI {
  constructor() {
    this._baseUrl = 'https://api.themoviedb.org/3';

    this._apiKey = 'ddaacfeafa0a336ed4cfe008b7b64f83';

    this.getResource = async (url) => {
      let result;
      try {
        result = await fetch(url);
        if (!result.ok) {
          throw new Error(`Could not fetch ${url}, recieved ${result.status}`);
        }
      } catch (error) {
        throw new Error(error);
      }

      let body;
      try {
        body = await result.json();
      } catch (error) {
        body = error;
      }
      return body;
    };

    this.getRating = async (id) => {
      const getRatingUrl = `${this._baseUrl}/movie/${id}/account_states`;

      if (this.guestSessionId === null) {
        this.guestSessionId = await this.createGuestSession();
      }
      const fullUrl = `${getRatingUrl}?&api_key=${this._apiKey}&guest_session_id=${this.guestSessionId}`;

      let value;
      try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error('Ошибка');
        }

        const result = await response.json();
        const rated = await result.rated;
        value = await rated.value;
      } catch (error) {
        // eslint-disable-next-line no-alert
        alert(error);
      }
      return value;
    };

    this.getRatingBound = this.getRating.bind(this);

    this.searchMovies = async (query, page, language, allowAdult) => {
      const searchUrl = `${this._baseUrl}${'/search/movie'}`;
      const fullUrl = `${searchUrl}?query=${query}&api_key=${this._apiKey}&page=${page}&include_adult=${allowAdult}&language=${language}`;

      const response = await this.getResource(fullUrl);
      const results = await response.results;
      const totalResults = await response.total_results;

      return {
        results,
        totalResults,
      };
    };

    this.createGuestSession = async () => {
      const guestSessionUrl = `${this._baseUrl}/authentication/guest_session/new`;
      const fullUrl = `${guestSessionUrl}?&api_key=${this._apiKey}`;

      let response;
      try {
        response = await this.getResource(fullUrl);
        if (!response.success) {
          throw new Error('No guest sessions today!');
        }
      } catch (error) {
        return null;
      }

      const guestSessionId = await response.guest_session_id;

      return guestSessionId;
    };

    this.guestSessionId = null;

    this.rate = async (value, id) => {
      const rateUrl = `${this._baseUrl}/movie/${id}/rating`;
      if (this.guestSessionId === null) {
        this.guestSessionId = await this.createGuestSession();
      }
      const fullUrl = `${rateUrl}?&api_key=${this._apiKey}&guest_session_id=${this.guestSessionId}`;

      const rating = { value };
      const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(rating),
      };

      let response;
      try {
        response = await fetch(fullUrl, fetchOptions);
        if (!response.ok) {
          throw new Error('Ошибка');
        }

        this.getRatedMovies();
      } catch (error) {
        // eslint-disable-next-line no-alert
        alert(error);
      }
    };

    this.getRatedMovies = async () => {
      if (this.guestSessionId === null) {
        this.guestSessionId = await this.createGuestSession();
      }

      const getRatingUrl = `${this._baseUrl}/guest_session/${this.guestSessionId}/rated/movies`;
      const fullUrl = `${getRatingUrl}?&api_key=${this._apiKey}`;

      return this.getResource(fullUrl);
    };

    this.getAllGenres = async () => {
      const genresUrl = `${this._baseUrl}/genre/movie/list`;
      const fullUrl = `${genresUrl}?&api_key=${this._apiKey}`;

      return this.getResource(fullUrl);
    };
  }
}
