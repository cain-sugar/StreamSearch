const apis = require('./request');
const hulu = require('./hulu');

const getMovies = async (query) => {
  const utelly = await apis.utellyGet(query);
  const kitsu = await apis.anime(query);
  const movieDB = await apis.movies(query);
  const titles = utelly.data.results.map(vid => vid.name);
  const movies = movieDB.data.results.reduce((a, b) => {
    if (b && (titles.includes(b.title) || hulu.includes(b.title)) && b.vote_count) {
      a.push({
        title: b.title,
        poster: `http://image.tmdb.org/t/p/w780/${b.poster_path}`,
        backdrop: `http://image.tmdb.org/t/p/w780/${b.backdrop_path}`,
        overview: b.overview,
        services: utelly.data.results[titles.indexOf(b.title)].locations,
        hulu: hulu.includes(b.title),
      });
      return a;
    }
    return a;
  }, []);
  if (movies.length < 5) {
    const anim = kitsu.data.data.map((anime) => {
      const title = anime.attributes.titles.en_us || anime.attributes.titles.en || anime.attributes.titles.ja_jp
      const endpoint = title.split(' ').join('-');
      return ({
        title,
        poster: anime.attributes.posterImage.small,
        overview: anime.attributes.synopsis,
        services: [{ display_name: 'Crunchyroll', url: `https://www.crunchyroll.com/${endpoint}` }],
        hulu: hulu.includes(title),
      });
    });
    for (let i = 0; movies.length < 5; i += 1) {
      movies.push(anim[i]);
    }
  }
  return movies;
};

module.exports.getMovies = getMovies;
