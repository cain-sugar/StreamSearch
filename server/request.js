const axios = require('axios');
const bluebird = require('bluebird');
const anime = require('../sampledata/kitsu');
const movies = require('../sampledata/movieDB');
const utelly = require('../sampledata/utelly');

const utellyGet = ({ searchTerm, type }) => {
  // axios({
  //   method: 'GET',
  //   url: `https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${query.title}&country=${query.location}`,
  //   header: { 'X-RapidAPI-Key': process.env.UTELLY },
  // });
  return utelly;
};

module.exports.utellyGet = utellyGet;


const movieDbGet = ({ searchTerm, type }) => {
  // axios({
  //     method: 'GET',
  //     url: `https://api.themoviedb.org/3/search/${query.type}`,
  //     params: {
  //       api_key: process.env.MDB,
  //       query: query.query,
  //       sort_by: query.sort_by,
  //     },
  //   });
  // }
  return movies;
};

module.exports.movies = movieDbGet;

const animeGet = ({ searchTerm, type }) => {
  // axios({
  //   method: 'get',
  //   url: `https://kitsu.io/api/edge/anime?filter[text]=${query.term}&filter[streamers]=crunchyroll`,
  //   headers: {
  //     Accept: 'application/vnd.api+json',
  //     'Content-Type': 'application/vnd.api+json',
  //   },
  // });
  return anime;
};

module.exports.anime = animeGet;
