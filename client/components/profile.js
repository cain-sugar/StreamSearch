angular.module('app')
  .component('profile', {
    bindings: {
      path: '<',
    },
    controller(Serve) {
      this.username = 'Ablung';
      this.services = [];
      Serve.getInfo(this.username, (userInfo) => {
        const keys = Object.keys(userInfo);
        keys.forEach((key) => {
          if (userInfo[key] === '1' && key !== 'id_service') this.services.push(key.slice(8));
        });
      });
    },
    templateUrl: '/templates/profile.html',
  });
