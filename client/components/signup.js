angular.module('app')
  .component('signup', {
    bindings: {
      path: '<',
      log: '<',
    },
    controller(Serve) {
      this.username = null;
      this.fullname = null;
      this.password = null;
      this.country = null;

      this.createUser = (services) => {
        Serve.signup(this.username, this.fullname, this.password, this.country, services);
      };
    },
    templateUrl: '/templates/signup.html',
  });
