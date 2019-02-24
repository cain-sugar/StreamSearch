

angular.module('app')
  .service('Serve', function Serve($http) {
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

    this.signup = (username, fullname, password, country, services) => {
      $http.post('/signup', {
        username, fullname, password, country, services,
      })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          alert(error.data);
        });
    };

    this.search = (query, callback) => {
      console.log(query);
      $http({
        url: '/search',
        params: query,
        method: 'GET',
      })
        .then(callback)
        .catch(callback);
    };

    // this.getInfo = (username) => {
    //   console.log(username);
    //   $http.get('/profile-load', username)
    //     .then(console.log('cool'))
    //     .catch(console.log('error'));
    // };
  });
