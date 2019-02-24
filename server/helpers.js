const apis = require('./request');

const getMovies = async (query) => {
  const utelly = await apis.utellyGet(query);
  const kitsu = await apis.anime(query);
  const movieDB = await apis.movies(query);
  const titles = utelly.results.map(movie => movie.name);
  const movies = movieDB.results.reduce((a, b) => {
    if (b && titles.includes(b.title) && b.vote_count) {
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
  if (movies.length < 5) {
    const anim = kitsu.data.map((anime) => {
      let endpoint = '';
      if (anime.attributes.titles.en_us) {
        endpoint = anime.attributes.titles.en_us.split(' ').join('-');
      }
      return ({
        title: anime.attributes.titles.en_us,
        poster: anime.attributes.posterImage.small,
        overview: anime.attributes.synopsis,
        services: [{ display_name: 'Crunchyroll', url: `https://www.crunchyroll.com/${endpoint}` }],
      });
    });
    for (let i = 0; movies.length < 5; i += 1) {
      movies.push(anim[i]);
    }
  }
  return movies;
};

module.exports.getMovies = getMovies;
