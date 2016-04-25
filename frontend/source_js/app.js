var app = angular.module('mainApp', ['ngRoute', 'AppControllers', 'AppServices', 'rzModule']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'homeController'
    }).when('/secondview', {
        templateUrl: 'partials/secondview.html',
        controller: 'SecondController'
    }).when('/function', {
        templateUrl: 'partials/function.html',
        controller: 'functionController'
    }).otherwise({
        redirectTo: '/home'
    });
}]);

app.run(function ($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        $(document).foundation();
    });
});
