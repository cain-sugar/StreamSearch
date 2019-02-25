const apis = require('./request');
const hulu = require('./hulu');

const getMovies = async (query) => {
  const utelly = await apis.utellyGet(query);
  const kitsu = await apis.anime(query);
  const movieDB = await apis.movies(query);
  const titles = utelly.data.results.map(vid => vid.name);
  const movies = movieDB.data.results.reduce((a, b) => {
    if (b.hasOwnProperty('name')) {
      b.title = b.name;
    }
    let partial = b.title;
    let kit = kitsu.data.data.map(anime => anime.attributes.titles.en_us || anime.attributes.titles.en || anime.attributes.titles.ja_jp);
    if (b.title.includes('The ')) {
      partial = b.title.replace('The ', '');
    } else if (b.title.includes('!')) {
      partial = b.title.replace('!', '');
    }
    let index;
    let services;
    if (titles.indexOf(partial) < 0) {
      index = titles.indexOf(b.title);
      if (index > 0) {
        services = utelly.data.results[index].locations;
      }
    } else {
      index = titles.indexOf(partial);
      services = utelly.data.results[index].locations;
    }
    if (b && (titles.join('').includes(partial) || hulu.includes(b.title)) && b.popularity) {
      a.push({
        title: b.title,
        poster: `http://image.tmdb.org/t/p/w780/${b.poster_path}`,
        backdrop: `http://image.tmdb.org/t/p/w780/${b.backdrop_path}`,
        overview: b.overview,
        services,
        hulu: hulu.includes(b.title),
        anime: kit.includes(b.title),
      });
      return a;
    }
    return a;
  }, []).filter(vids => vids !== undefined);
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
