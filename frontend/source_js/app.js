var app = angular.module('mainApp', ['ngRoute', 'AppControllers', 'AppServices']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/home', {
    templateUrl: 'partials/home.html',
    controller: 'homeController'
  }).
  when('/secondview', {
    templateUrl: 'partials/secondview.html',
    controller: 'SecondController'
  }).
  when('/llamalist', {
    templateUrl: 'partials/llamalist.html',
    controller: 'LlamaListController'
  }).
  otherwise({
    redirectTo: '/home'
  });
}]);
