const apis = require('./request');

let getMovies = async (query) => {
  const utelly = await apis.utellyGet(query);
  const kitsu = await apis.anime(query);
  const movieDB = await apis.movies(query);
  const titles = utelly.results.map(movie => movie.name);
  const movies = movieDB.results.reduce((a, b) => {
    if (titles.includes(b.title) && b.vote_count) {
      a.push({
        title: b.title,
        poster: `http://image.tmdb.org/t/p/w780/${b.poster_path}`,
        backdrop: `http://image.tmdb.org/t/p/w780/${b.backdrop_path}`,
        overview: b.overview,
        services: utelly.results[titles.indexOf(b.title)].locations,
      });
      return a;
    }
    return a;
  }, []);
  return movies;
};

module.exports.getMovies = getMovies;
