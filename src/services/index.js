export default class MovieApi {
  _baseURL = 'https://api.themoviedb.org/3';

  _api_key = 'api_key=ddaacfeafa0a336ed4cfe008b7b64f83';

  getResource = async (url, query) => {
    const searchUrl = `${this._baseURL}${url}`;
    const fullURL = `${searchUrl}?${this._api_key}&query=${query}`;
    const result = await fetch(fullURL);

    if (!result.ok) {
      throw new Error(`Could not fetch ${searchUrl}, recieved ${result.status}`);
    }

    const body = await result.json();
    return body;
  };

  searchMovies = async (query) => {
    const movies = await this.getResource('/search/movie', query);
    return movies.results;
  };
}
