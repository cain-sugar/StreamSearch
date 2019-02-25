angular.module('app')
  .component('profile', {
    bindings: {
      path: '<',
      clickedService: '<',
    },
    controller(Serve) {
      this.services = [];
      this.favorites = [];
      this.watchList = [];

      Serve.getMovies(Serve.username, (userMovies) => {
        userMovies.forEach((movie) => {
          if (movie.favorite) this.favorites.push(movie);
          else this.watchList.push(movie);
        });
        console.log(this.favorites);
        console.log(this.watchList);
      });

      Serve.getServices(Serve.username, (userInfo) => {
        const keys = Object.keys(userInfo);
        keys.forEach((key) => {
          if (userInfo[key] === '1' && key !== 'id_service') this.services.push(key.slice(8));
        });
      });

      this.changeService = (clickedService) => {
        console.log(clickedService, 'click registered in profile.js');
        this.status = !this.status;
      };
    },
    templateUrl: '/templates/profile.html',
  });
