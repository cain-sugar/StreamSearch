angular.module('app')
  .component('app', {
    bindings: {},
    controller() {
      // this.data = window.data.Search;
      this.username = undefined;
      this.setUsername = (name) => {
        this.username = name;
        console.log(this.username)
      };
      this.route = '/';
      this.login = () => {
        console.log('hi');
      };
    },
    templateUrl: '../templates/app.html',
  });

// Add a create session function and send down information to log in and signup
