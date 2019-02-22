angular.module('app')
  .component('profile', {
    bindings: {
      path: '<',
    },
    controller(Serve) {
      // this.username = 'kc';
      // Serve.getInfo(this.username);
    },
    templateUrl: '/templates/profile.html',
  });
