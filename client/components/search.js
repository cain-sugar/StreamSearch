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
      this.setData = (data) => {
        console.log(data);
        this.data = data.data;
        M.AutoInit();
      };
      this.searchFor = (searchTerm, type) => {
        console.log(type);
        const query = { searchTerm, type };
        Serve.search(query, this.setData);
      };
      this.setData = this.setData.bind(this);
    },
    templateUrl: 'templates/search.html',
  });
