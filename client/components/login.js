angular.module('app')
  .component('login', {
    bindings: {
      path: '<',
    },
    controller(Serve, $location) {
      this.username = null;
      this.password = null;

      this.login = () => {
        $location.path('search');
        console.log(`logging in ${this.username}...`);
        Serve.login(this.username, this.password);
        //  itemsService.sendText(username, password);
      };
    },
    templateUrl: '/templates/login.html',
  });
