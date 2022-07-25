export default class MovieApi {
  constructor() {
    this._baseURL = 'https://api.themoviedb.org/3';

    this._api_key = 'api_key=ddaacfeafa0a336ed4cfe008b7b64f83';

    this.getResource = async (url) => {
      const result = await fetch(url);

      if (!result.ok) {
        throw new Error(`Could not fetch ${url}, recieved ${result.status}`);
      }

      const body = await result.json();
      return body;
    };

    this.searchMovies = async (query, page) => {
      const searchUrl = `${this._baseURL}${'/search/movie'}`;
      const fullURL = `${searchUrl}?${this._api_key}&language=en-US&query=${query}&page=${page}&include_adult=false`;
      const movies = await this.getResource(fullURL);
      return movies.results;
    };
  }
}
