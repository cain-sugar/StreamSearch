// import { setServers } from "dns";
// poster data for init of carousel
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
      // init materialize components
      M.AutoInit();
      // video data
      this.data = data.Search;
      // current target
      this.targ = '0';
      // current target after 1 second
      this.target = '0';
      // when true displays movie descriptions
      this.expanded = false;
      // changes expanded
      this.isExpanded = () => {
        this.expanded = !this.expanded;
      };
      // sets the movie data
      this.setData = (data) => {
        this.data = data.data;
        M.AutoInit();
      };
      // Search takes in term and type -> movie or tv
      // !!!Important!!! type must be lowercase
      this.searchFor = (searchTerm, type) => {
        const query = { searchTerm, type };
        Serve.search(query, this.setData);
        this.target = 0;
        this.targ = 0;
      };
      // bind this for callback purposes
      this.setData = this.setData.bind(this);
      // to avoid an error which occured if user clicked in rapid succession
      // a set timeout of one second exist
      this.setTarget = (target) => {
        console.log(target);
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
      // add to favorites
      this.favoritedMovie = () => {
        const resultSrc = this.data[this.targ].poster;
        const resultMovieName = this.data[this.targ].title;
        const favorite = true;
        const watchLater = false;
        const services = this.services();
        Serve.favoritedMovie(resultMovieName, resultSrc, favorite, watchLater, services, Serve.username);
      };
      // add to watch later
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
