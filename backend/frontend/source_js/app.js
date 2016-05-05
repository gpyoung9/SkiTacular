var app = angular.module('mainApp', ['ngRoute', 'AppControllers', 'AppServices', 'rzModule', 'ngAnimate', 'simplePagination']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'homeController'
    }).when('/discover', {
        templateUrl: 'partials/function.html',
        controller: 'functionController'
    }).when('/favorites', {
        templateUrl: 'partials/favorites.html',
        controller: 'favoritesController'
    }).when('/suggested', {
        templateUrl: 'partials/suggested.html',
        controller: 'suggestedController'
    }).when('/details/:id', {
        templateUrl: 'partials/details.html',
        controller: 'detailsController'
    }).otherwise({
        redirectTo: '/home'
    });
}]);

app.run(function ($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        $(document).foundation();
    });
});
