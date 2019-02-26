angular.module('app')
  .component('login', {
    bindings: {
      user: '<',
    },
    controller(Serve, $location) {
      this.username = null;
      this.password = null;

      this.taken = false;

      this.login = () => {
        Serve.login(this.username, this.password, (response) => {
          if (response !== 'good') {
            // redirect to login if login fails
            $location.path('login');
            this.wrong = true;
          } else {
            // send to search page on good login
            $location.path('search');
          }
        });
        console.log(`logging in ${this.username}...`);
        //  itemsService.sendText(username, password);
      };
    },
    templateUrl: '/templates/login.html',
  });
