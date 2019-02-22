angular.module('app')
  .component('selectServices', {
    bindings: {
      createUser: '<',
    },
    controller() {
      M.AutoInit();

      const selectServices = this;

      selectServices.serviceList = {
        crunchyroll: false,
        googleplay: false,
        hulu: false,
        iTunes: false,
        netflix: false,
        primevideo: false,
      };

      selectServices.click = (service) => {
        selectServices.serviceList[service] = !selectServices.serviceList[service];
      };
    },
    templateUrl: '../templates/selectServices.html',
  });
