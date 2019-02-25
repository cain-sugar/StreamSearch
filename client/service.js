

angular.module('app')
  .service('Serve', function Serve($http) {
    this.username = undefined;
    this.login = (username, password) => {
      $http.post('/login', {
        username, password,
      })
        .then((response) => {
          if (response.message === 'logged in successfully') {
            console.log(response, `${username} succesfully logged in!`);
          } else {
            console.log(`failed to login ${username}`);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    this.signup = (username, fullname, password, country, services, cb) => {
      $http.post('/signup', {
        username, fullname, password, country, services,
      })
        .then((response) => {
          cb(response.data);
        })
        .catch((error) => {
          cb(error.data);
        });
    };

    this.search = (query, callback) => {
      $http({
        url: '/search',
        params: query,
        method: 'GET',
      })
        .then(callback)
        .catch(callback);
    };

    
    this.favoritedMovie = (resultMovieName, resultSrc, favorite, watchLater, services, user, callback) => {
      $http.post('/favoritedMovie', {
        resultMovieName, resultSrc, favorite, watchLater, services, user,
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    };


    this.getServices = (username, cb) => {
      $http.get(`/profile/${username}/favorites`, {
        params: { username },
      })
        .then((response) => {
          cb(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    this.getMovies = (username, cb) => {
      $http.get(`/profile/${username}/movies`, {
        params: { username },
      })
        .then((response) => {
          cb(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    this.updateServices = (service, username, value, callback) => {
      $http.patch('/profile', {
        service, username, value,
      })
        .then((response) => {
          callback(response);
        })
        .catch((error) => {
          console.log('error sending info back to service.js (service.js (73-83))');
        });
    };
  });
