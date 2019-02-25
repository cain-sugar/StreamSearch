angular.module('app')
  .component('sidebar', {
    templateUrl: 'templates/sideBar.html',
    bindings: {},
    controller(Serve) {
      M.AutoInit();
      
      this.username = Serve.username;
    console.log(Serve.username);
    },

  });
