angular.module('app')
  .component('app', {
    bindings: {},
    controller() {
      // this.data = window.data.Search;
      this.getUserData = (data) => {
      //  itemsService.getAll(function (data) {
      //  this.items = data;
      //  })
      };
      this.route = '/';
      this.login = () => {
        console.log('hi');
      };
    },
    templateUrl: '../templates/app.html',
  });

// Add a create session function and send down information to log in and signup
