angular.module('app', ['ui.router']).config(($stateProvider, $locationProvider) => {
  // $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('StreamSearch');
  const appState = {
    name: 'app',
    url: '/',
    component: 'app',
  };

  const blankState = {
    name: 'blank',
    url: '',
    redirectTo: 'app',
  };

  const signupState = {
    name: 'signup',
    url: '/signup',
    component: 'signup',
  };

  const loginState = {
    name: 'login',
    url: '/login',
    component: 'login',
  };

  const logoutState = {
    name: 'logout',
    url: '/logout',
    redirectTo: 'app',
  };

  const searchState = {
    name: 'search',
    url: '/search',
    component: 'search',
  };

  const profileState = {
    name: 'profile',
    url: '/profile',
    component: 'profile',
  };

  $stateProvider.state(signupState);
  $stateProvider.state(loginState);
  $stateProvider.state(logoutState);
  $stateProvider.state(appState);
  $stateProvider.state(blankState);
  $stateProvider.state(searchState);
  $stateProvider.state(profileState);
});

// 'itemsService'
