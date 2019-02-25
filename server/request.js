const axios = require('axios');
const bluebird = require('bluebird');

const utellyGet = ({ searchTerm, type }) => {
  const utelly = axios({
    method: 'GET',
    url: `https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${searchTerm}&country=us`,
    headers: { 'X-RapidAPI-Key': process.env.UTELLY_API },
  });
  return utelly;
};

module.exports.utellyGet = utellyGet;


const movieDbGet = ({ searchTerm, type }) => {
  const movie = axios({
    method: 'GET',
    url: `https://api.themoviedb.org/3/search/${type}?api_key=${process.env.TMDB_API}&query=${searchTerm}`,
  });
  return movie;
};

module.exports.movies = movieDbGet;

const animeGet = async ({ searchTerm, type }) => {
  const anime = await axios({
    method: 'get',
    url: `https://kitsu.io/api/edge/anime?filter[text]=${searchTerm}&filter[streamers]=crunchyroll`,
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  });
  console.log(anime);
  return anime;
};

module.exports.anime = animeGet;
