const express = require('express');

const app = express();

const session = require('express-session');

const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database/index.js');
const utellySample = require('../sampledata/utelly');


require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('client'));
app.use(express.static('node_modules'));


// creates the sessionID
app.use(session({
  genid: (request) => {
    console.log('inside session');
    console.log(request.sessionID);
    return uuid();
  },
  store: new FileStore(),
  secret: 'cain is sour, never sweet',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


// passport strategy to authenticate username and password
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, (username, password, done) => {
  db.User.findOne({ username, password })
    .then((user) => {
      if (user.user_name !== username) {
        return done(null, false, { message: 'Incorrect usernmae'});
      }
      if (!bcrypt.compare(password, user.hashed_password)) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user, { message: 'logged in successfully' });
    });
}));

// user id is saved to the session file store here
passport.serializeUser((user, done) => {
  return done(null, user.id_user); // id_user
});
// Get User Profile information /////////////////////////////////////////////////////////////////
app.get('/profile/:username/favorites', (req, res) => {
  const { username } = req.query;
  db.getUserServices(username, (result) => {
    res.status(200).send(result);
  });
});

app.get('/profile/:username/movies', (req, res) => {
  const { username } = req.query;
  db.getUserMovies(username, (result) => {
    res.status(200).send(result);
  });
});
// Get User Profile information End//////////////////////////////////////////////////////////////

// the user id passport is saved in the session file
// retrieves the user profile based on id
// when the id is needed later, passport will use this id to retrieve the user from the db
passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser callback');
  console.log(`The user id passport saved in the session file store is: ${id}`);
  db.User.findById(id)
    .then((response) => {
      return done(null, response);
    });
});

// uses the get method to see if a user is authenticated to view certain pages
app.get('/authrequired', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n');
  } else {
    res.redirect('/');
  }
// activates when a user clicks the services on their profile
app.patch('/profile', (req, res) => {
  // should perform an update query to database
  // should be able to add or remove services
  console.log(req.body, 'server.js');
  db.funcToToggleServices(req, (result) => {
    console.log(result);
  });
  res.send('cool');
});

app.get('/', (request, response) => {
  const uniqueID = uuid();
  response.send(200);
});

// uses local strategy to login
app.post('/login', (req, res, callback) => {
  passport.authenticate('local', (err, user, info) => {
    if (info) {
      return res.send(info);
    }
    if (err) {
      return callback(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.login(user, (error) => {
      if (error) {
        return callback(error);
      }
    });
  })(req, res);
});

app.get('/login', (req, res) => {
  console.log(req.sessionID);
  res.send('logged in');
});

app.post('/favoritedMovie', (req, res) => {
  db.saveMovieHelperFunc(req, (response) => {
    console.log(response);
    res.status(201).send();
  });
});

  // let services = req.body.services;
  // const crunchyroll = services.crunchyroll;
  // const googleplay = services.googleplay;
  // const hulu = services.hulu;
  // const iTunes = services.iTunes;
  // const netflix = services.netflix;
  // const primevideo = services.primevideo;

  //////////////////////////////////////////////////////////
  //Users///////////////////////////////////////////////////
  let username = req.body.username;
  let country = req.body.country;
  let fullname = req.body.fullname;
  const salt = bcrypt.genSaltSync(8);
  const hashPassword = bcrypt.hashSync(req.body.password, salt);

  db.User.create({
    user_name: username,
    user_fullname: fullname,
    hashed_password: hashPassword,
    user_country: country,
  });
  //////////////////////////////////////////////////////////

  //redirect to '/search'
  res.send('server recieved signup');
  
})

//routes the user to their profile and queries database for their info
app.get('/profile', (req, res) => {
  //call query function in database
  //should return favorites
  //should return watch later
  //should return users services
})

//activates when a user clicks the services on their profile
app.patch('/profile', (req, res) => {
  //should perform an update query to database
  //should be able to add or remove services
})

//triggered when user tries to access main page (search page?)
app.get('/', (req, res) => {
  //should check for user authorization
  //if correct redirect user to '/search'
  //if not, redirect to login
  //query database for favorites
  //if no favorites exists, send axios request for top movies to display
})

//get request sent when search is performed
app.post('/search', (req, res) => {
  //should call axios requests
  //should send results to client and database
  console.log(req.body, 'server received this search request')
  res.status(200).send(utellySample);
})

//get request sent on logout click
app.get('/logout', (req, res) => {
  //close user session and delete cookies
  //redirect to '/login'
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
})

