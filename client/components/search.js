// import { setServers } from "dns";

const data = {
  Search: [
    {
      title: '',
      poster: 'assets/serviceLogos/reel.png',
    },
    {
      title: '',
      poster: 'assets/serviceLogos/reel.png',
    },
    {
      title: '',
      poster: 'assets/serviceLogos/reel.png',
    },
    {
      title: '',
      poster: 'assets/serviceLogos/reel.png',
    },
    {
      title: '',
      poster: 'assets/serviceLogos/reel.png',
    },
  ],
};

angular.module('app')
  .component('search', {
    bindings: {
    },
    controller(Serve) {
      M.AutoInit();
      this.data = data.Search;
      this.targ = '0';
      this.target = '0';
      this.expanded = false;
      this.isExpanded = () => {
        this.expanded = !this.expanded;
      };
      this.setData = (data) => {
        this.data = data.data;
        M.AutoInit();
      };
      this.searchFor = (searchTerm, type) => {
        const query = { searchTerm, type };
        Serve.search(query, this.setData);
        this.target = 0;
        this.targ = 0;
      };
      this.setData = this.setData.bind(this);
      this.setTarget = (target) => {
        const that = this;
        this.targ = target;
        setTimeout(() => { that.target = target; }, 1000);
      };

      this.services = () => {
        const options = {
          crunchyroll: false,
          googleplay: false,
          hulu: false,
          iTunes: false,
          netflix: false,
          primevideo: false,
        };
        if (this.data[this.target].services) {
          this.data[this.target].services.forEach((service) => {
            if (Object.keys(options).includes(service.display_name)) {
              options[service.display_name] = true;
            }
          });
        }
        if (this.data[this.target].hulu) {
          options.hulu = true;
        }
        return options;
      };

      this.favoritedMovie = () => {
        const resultSrc = this.data[this.targ].poster;
        const resultMovieName = this.data[this.targ].title;
        const favorite = true;
        const watchLater = false;
        const services = this.services();
        Serve.favoritedMovie(resultMovieName, resultSrc, favorite, watchLater, services, Serve.username);
      };

      this.watchLaterMovie = () => {
        const resultSrc = this.data[this.target].poster;
        const resultMovieName = this.data[this.target].title;
        const favorite = false;
        const watchLater = true;
        const services = this.services();
        Serve.favoritedMovie(resultMovieName, resultSrc, favorite, watchLater, services, Serve.username);
      };
    },
    templateUrl: 'templates/search.html',
  });
