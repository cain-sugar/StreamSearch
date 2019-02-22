const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../database/index.js');
const utellySample = require('../sampledata/utelly.json');
const LocalStrategy = require('passport-local').Strategy;


// add and configure middleware
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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


const users = [{ id: 983, username: 'tonild', password: 'erika31' }];

// passport strategy to authenticate username and password
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, (username, password, callback) => {
  // db.findOne({ username, password })
  //   .then((user) => {
  //     if (!user) {
  //       return callback(null, false, { message: 'Incorrect username or password' });
  //     }
        // if (!bcrypt.compareSync(password, user.password)) {
        //   return callback(null, false, { message: 'Incorrect password'})
        // } else {
          //     return callback(null, user, { message: 'logged in successfully' });
        // }
  //   })
  //   .catch((err) => {
  //     callback(err);
  //   });
  const user = users[0];
  if (username === user.username && password === user.password) {
    return callback(null, user);
  }
}));

// user id is saved to the session file store here
passport.serializeUser((user, callback) => {
  callback(null, user.id); // id_user
});

// the user id passport is saved in the session file
// retrieves the user profile based on id
passport.deserializeUser((id, callback) => {
  console.log('Inside deserializeUser callback');
  console.log(`The user id passport saved in the session file store is: ${id}`);
  // db.get({ id })
  //   .then((response) => {
  //     callback(null, response.data);
  //   })
  //   .catch((err) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //   });
  const user = users[0].id === id ? users[0] : false;
  callback(null, user);
});

// uses the get method to see if a user is authenticated to view certain pages
app.get('/authrequired', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n');
  } else {
    res.redirect('/');
  }
});

app.get('/', (request, response) => {
  const uniqueID = uuid();
  response.send(200);
});

// uses local strategy to login
app.post('/login', (req, res, callback) => {
  passport.authenticate('local', (err, user, info) => {
    if (info) {
      return res.send(info.message);
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
      res.redirect('/authrequired');
    });
  })(req, res);
});

app.get('/login', (req, res) => {
  console.log(req.sessionID);
  res.send('logged in');
})

app.post('/signup', (req, res) => {
  console.log(req.sessionID);
  console.log(req.body);
  //Services//////////////////////////////////////////////
  let services = req.body.services;
  const crunchyroll = services.crunchyroll;
  const googleplay = services.googleplay;
  const hulu = services.hulu;
  const iTunes = services.iTunes;
  const netflix = services.netflix;
  const primevideo = services.primevideo;

  db.Service.create({
    service_crunchyroll: crunchyroll,
    service_googleplay: googleplay,
    service_hulu: hulu,
    service_iTunes: iTunes,
    service_netflix: netflix,
    service_primevideo: primevideo
  });
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

