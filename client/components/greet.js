angular.module('app')
  .component('greet', {
    bindings: {
      log: '<',
      path: '<',
    },
    controller() {
      // init materialize elements
      M.AutoInit();
    },
    templateUrl: '../templates/greet.html',
  });
