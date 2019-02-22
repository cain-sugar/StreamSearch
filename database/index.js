const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const db = new Sequelize('streamsearch', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
});

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
});

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
  // service_logo: Sequelize.STRING,
});

const Movie = db.define('Movie', {
  id_movie: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  movie_title: Sequelize.STRING,
  box_art: Sequelize.STRING,
  release_year: Sequelize.INTEGER,
  favorite: Sequelize.BOOLEAN,
  watch_later: Sequelize.BOOLEAN,
  recently_searched: Sequelize.BOOLEAN,

});


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
Movie.belongsToMany(Service, { through: Movie_Service });
Service.belongsToMany(Movie, { through: Movie_Service });


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

db.sync({ });
//force: true

const usernameInDb = (username) => {
  User.findOne({ user_name: username });
};


db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  })
  .done();

// Helper Function to populate service and user tables and join table///////////////////////////////
const userServiceHelperFunc = (req, cb) => {
  // Services //////////////////////////////
  const services = req.body.services;
  const crunchyroll = services.crunchyroll;
  const googleplay = services.googleplay;
  const hulu = services.hulu;
  const iTunes = services.iTunes;
  const netflix = services.netflix;
  const primevideo = services.primevideo;
  // Services End ///////////////////////////

  // Users //////////////////////////////
  const username = req.body.username;
  const country = req.body.country;
  const fullname = req.body.fullname;
  const salt = bcrypt.genSaltSync(8);
  const hashPassword = bcrypt.hashSync(req.body.password, salt);
  // Users End ///////////////////////////
  User.create({
    user_name: username,
    user_fullname: fullname,
    hashed_password: hashPassword,
    user_country: country,
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

// let userid = (`SELECT id_user FROM users WHERE user_name="${username}"` );
// let userid = (users.findAll({where: {user_name="`${username}`"}}));
// let servicesID = (`SELECT ServiceIdService FROM user_services WHERE UserIdUser ="${userid}" `);
// let servicesID = user_services.findOne({where:{UserIdUser="`${userid}"}, attributes:[id_user_services,[ServiceIdService, UserIdUser]]})
// let services = (`SELECT * FROM services WHERE id_service=${servicesID}`);
// let services = (services.findAll({where: {id_services="`${servicesID}`"}}))

// const getUserInfo = (req, callback) => {
//   const username = req.body.username;
//   const userid = User.findAll({ where: { user_name: `${username}` } });
//   const servicesID = User_Service.findOne({ where: { UserIdUser: `${userid}` }, attributes: ['id_user_service', ['ServiceIdService', 'UserIdUser']] });
//   const services = (Service.findAll({ where: { id_service: `${servicesID}` } }));
//   console.log(services);
// };

module.exports = {
  User,
  Service,
  usernameInDb,
  userServiceHelperFunc,
  // getUserInfo,
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
