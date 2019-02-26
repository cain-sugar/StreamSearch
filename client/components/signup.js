angular.module('app')
  .component('signup', {
    bindings: {
      path: '<',
      log: '<',
    },
    controller(Serve, $location) {
      this.username = null;
      this.fullname = null;
      this.password = null;
      this.country = null;
      this.session = null;

      this.taken = false;

      this.createUser = (services) => {
        Serve.signup(this.username, this.fullname, this.password, this.country, services, this.session, (response) => {
          if (response === 'that username is already taken!') {
            this.taken = true;
          } else {
            // sets ui route location state to search component
            $location.path('search');
          }
        });
      };
    },
    templateUrl: '/templates/signup.html',
  });
