const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
// Uncomment line 147 to reset the database :)
require('dotenv').config();

const db = new Sequelize({
  host: 'localhost',
  // port: 3000,
  username: 'root',
  password: '',
  database: 'streamsearch',
  dialect: 'mysql',
  // dialectOptions: {
  //   ssl: 'Amazon RDS',
  // },
});

// User table in the database, cannot have duplicate username, session id stored here
const User = db.define('User', {
  id_user: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_name: {
    type: Sequelize.STRING,
    unique: true,
  },
  user_fullname: Sequelize.STRING,
  user_country: Sequelize.STRING,
  hashed_password: Sequelize.STRING.BINARY,
  user_session: Sequelize.STRING.BINARY,
});

// Server table, holds services
const Service = db.define('Service', {
  id_service: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  service_crunchyroll: Sequelize.STRING,
  service_googleplay: Sequelize.STRING,
  service_hulu: Sequelize.STRING,
  service_iTunes: Sequelize.STRING,
  service_netflix: Sequelize.STRING,
  service_primevideo: Sequelize.STRING,
});

// Movie table. If a user favorites or hits watch later it will be saved as 0 or 1 (T/F)
const Movie = db.define('Movie', {
  id_movie: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  movie_title: Sequelize.STRING,
  box_art: Sequelize.STRING,
  favorite: Sequelize.BOOLEAN,
  watch_later: Sequelize.BOOLEAN,
});

// Join table for movie and service table
const Movie_Service = db.define('Movie_Service', {
  id_service_movie: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_service: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Services',
      key: 'id_service',
    },
  },
  id_movie: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Movies',
      key: 'id_movie',
    },
  },
});
Movie_Service.belongsTo(Service);
Movie_Service.belongsTo(Movie);
Movie.belongsToMany(Service, { through: Movie_Service });
Service.belongsToMany(Movie, { through: Movie_Service });
// ^^Do not delete, needed to create join tables in sequalize

// This continues below
const User_Movie = db.define('User_Movie', {
  id_user_movie: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Users',
      key: 'id_user',
    },
  },
  id_movie: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Movies',
      key: 'id_movie',
    },
  },
});
User_Movie.belongsTo(User);
User_Movie.belongsTo(Movie);
User.belongsToMany(Movie, { through: User_Movie });
Movie.belongsToMany(User, { through: User_Movie });


const User_Service = db.define('User_Service', {
  id_user_service: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Users',
      key: 'id_user',
    },
  },
  id_service: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Services',
      key: 'id_service',
    },
  },
});
User_Service.belongsTo(User);
User_Service.belongsTo(Service);
User.belongsToMany(Service, { through: User_Service });
Service.belongsToMany(User, { through: User_Service });
// Last join table, real work below vv

// Clears and rebuilds the database
// db.sync({ force: true });

// Helper function that uses session to get the username. Session will not be changed
// but when refreshing the page, you would have to re-login to access user information
// It returns the username. Needs the async wait so it will retrieve the username b4 trying
// to run function that uses username.
const getUsernameFromSession = async (req) => {
  let username;
  const sessionID = req.sessionID;
  await User.findOne({ where: { user_session: sessionID } })
    .then((response) => {
      username = response.dataValues.user_name;
    });
  console.log(username);
  return username;
};

// Used in login func to check if username is in the db. Then runs the bcrypt compare
const usernameInDb = async (username) => {
  const user = await User.findOne({ where: { user_name: username } });
  return user;
};

// Authenticates it? I guess its necessary lol
db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  })
  .done();

// Helper Function to populate service and user tables and join table
const userServiceHelperFunc = (req, cb) => {
  // Services variables
  const services = req.body.services;
  const crunchyroll = services.crunchyroll;
  const googleplay = services.googleplay;
  const hulu = services.hulu;
  const iTunes = services.iTunes;
  const netflix = services.netflix;
  const primevideo = services.primevideo;
  // Services End

  // Users variable
  const username = req.body.username;
  const country = req.body.country;
  const fullname = req.body.fullname;
  const salt = bcrypt.genSaltSync(8);
  const hashPassword = bcrypt.hashSync(req.body.password, salt);
  const session = null;
  // Users End

  // Create user table, then creates service table. Promise.all is needed for creating
  // the join table (need both values). Used at signup
  User.create({
    user_name: username,
    user_fullname: fullname,
    hashed_password: hashPassword,
    user_country: country,
    user_session: session,
  })
    .then(user => Promise.all([
      user,
      Service.create({
        service_crunchyroll: crunchyroll,
        service_googleplay: googleplay,
        service_hulu: hulu,
        service_iTunes: iTunes,
        service_netflix: netflix,
        service_primevideo: primevideo,
      }),
    ]))
    .then(([user, streamingServices]) => {
      user.addService(streamingServices, { through: User_Service });
      cb('success');
    })
    .catch((err) => {
      console.error(err);
      cb('that username is already taken!');
    });
};

// Used in the user profile pages. Wind the services selected by the user, used for the profile page
const getUserServices = (username, cb) => {
  User.findOne({ where: { user_name: username } })
    .then((user) => {
      User_Service.findOne({
        where: { UserIdUser: user.id_user },
        attributes: ['ServiceIdService'],
      })
        .then(uService => Service.findOne({ where: { id_service: uService.ServiceIdService } }))
        .then((service) => {
          cb(service.dataValues);
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

const getUserMovies = async (req, cb) => {
  const username = await getUsernameFromSession(req);
  User.findOne({ where: { user_name: username } })
    .then((user) => {
      User_Movie.findAll({ // <--needs to be findAll, then find all movies.
        where: { UserIdUser: user.id_user },
        attributes: ['MovieIdMovie'],
      })
        .then((movies) => {
          const found = [];
          movies.forEach((movie) => {
            found.push(Movie.findOne({ where: { id_movie: movie.dataValues.MovieIdMovie } }));
          });
          return found;
        })
        .then((promisedMovies) => {
          Promise.all(promisedMovies)
            .then(pMovies => cb(pMovies));
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

// Most things needed the async await because we needed to query the database for the user_name from the
// session (req.sessionID). You can try it without it. We didn't have a lot of time to play with auth
const funcToMakeUserMovieTable = async (req, cb) => {
  const username = await getUsernameFromSession(req);
  const title = req.body.resultMovieName;
  Movie.findOne({ where: { movie_title: title } })
    .then((movie) => {
      User.findOne({ where: { user_name: username } })
        .then((user) => {
          user.addMovie(movie, { through: User_Movie });
        });
    })
    .catch((err) => {
      cb(err);
    });
};


const saveMovieHelperFunc = async (req, callback) => {
  const movie = req.body.resultMovieName;
  const src = req.body.resultSrc;
  const favorited = req.body.favorite;
  const watchLater = req.body.watchLater;
  const services = req.body.services;
  const crunchyroll = services.crunchyroll;
  const googleplay = services.googleplay;
  const hulu = services.hulu;
  const iTunes = services.iTunes;
  const netflix = services.netflix;
  const primevideo = services.primevideo;
  const username = await getUsernameFromSession(req);

  Promise.all([
    Movie.create({
      movie_title: movie,
      box_art: src,
      favorite: favorited,
      watch_later: watchLater,
    }),
    Service.create({
      service_crunchyroll: crunchyroll,
      service_googleplay: googleplay,
      service_hulu: hulu,
      service_iTunes: iTunes,
      service_netflix: netflix,
      service_primevideo: primevideo,
    }),
  ]).then(([pMovie, pServices]) => {
    pMovie.addService(pServices, { through: Movie_Service });
  }).then(() => {
    funcToMakeUserMovieTable(req, (response) => {
      callback(response);
    });
  })
    .catch((err) => {
      callback(err);
    });
};

const funcToToggleServices = async (req, cb) => {
  const services = req.body.service;
  const service_service = `service_${req.body.service}`;
  const value = req.body.value;
  const username = await getUsernameFromSession(req);

  User.findOne({ where: { user_name: username } }, services, service_service, value)
    .then((user) => {
      User_Service.findOne({
        where: { UserIdUser: user.id_user },
        attributes: ['ServiceIdService'],
      }, services, service_service, value)
        .then((allServices) => {
          // In the service table, find the services associated with the userID
          Service.findOne(
            { where: { id_service: allServices.dataValues.ServiceIdService } },
          )
            .then((val) => {
              // console.log(val.dataValues.id_service);
              // console.log(!value);
              // console.log(service_service);
              Service.update(
                { [service_service]: !value },
                { where: { id_service: val.dataValues.id_service } },
              );
            })
            .then((result) => {
              console.log(result);
            });
        }, services, service_service, value);
    });
};

const saveUserSession = async (req, callback) => {
  const session = req.sessionID;
  const username = await getUsernameFromSession(req);
  User.update(
    { user_session: session },
    { where: { user_name: username } },
  )
    .then((response) => {
      console.log(response);
      callback('good');
    })
    .catch((error) => {
      console.log(error);
    });
};


module.exports = {
  User,
  Service,
  usernameInDb,
  userServiceHelperFunc,
  saveMovieHelperFunc,
  getUserServices,
  getUserMovies,
  funcToMakeUserMovieTable,
  funcToToggleServices,
  saveUserSession,
  getUsernameFromSession,
};


/*
Will wait for both to finish
Promise.all([
        db.User.create({
          user_name: username,
          user_fullname: fullname,
          hashed_password: hashPassword,
          user_country: country,
        }),
        db.Service.create({
          service_crunchyroll: crunchyroll,
          service_googleplay: googleplay,
          service_hulu: hulu,
          service_iTunes: iTunes,
          service_netflix: netflix,
          service_primevideo: primevideo,
        }),
      ]).then(([ user, services ]) => {
      console.log({ user, services });
    });
*/
