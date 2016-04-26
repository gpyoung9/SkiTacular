var AppControllers = angular.module('AppControllers', []);

AppControllers.controller('homeController', ['$scope', 'CommonData', function ($scope, CommonData) {
    $scope.data = "";
    $scope.displayText = "";


    $scope.setData = function () {
        CommonData.setData($scope.data);
        $scope.displayText = "Data set"
    };
}]);

AppControllers.controller('mainController', ['$scope', 'CommonData', function ($scope, CommonData) {
    $scope.data = "";
    $scope.displayText = "";
    $scope.login_status = CommonData.get_login();


    $scope.setData = function () {
        CommonData.setData($scope.data);
        $scope.displayText = "Data set"

    };

}]);

AppControllers.controller('SecondController', ['$scope', 'CommonData', function ($scope, CommonData) {
    $scope.data = "";

    $scope.getData = function () {
        $scope.data = CommonData.getData();

    };

}]);


AppControllers.controller('functionController', ['$scope', '$http', '$window', function ($scope, $http, $window) {


    $scope.price_slider = {
        minValue: 50,
        maxValue: 500,
        options: {
            ceil: 500,
            floor: 0,
            showTicksValues: false
        }
    };

    $scope.distance_slider = {
        minValue: 10,
        maxValue: 600,
        options: {
            ceil: 600,
            floor: 10,
            showTicksValues: false
        }
    };


}]);

AppControllers.controller('SettingsController', ['$scope', '$window', function ($scope, $window) {
    $scope.url = $window.sessionStorage.baseurl;

    $scope.setUrl = function () {
        $window.sessionStorage.baseurl = $scope.url;
        $scope.displayText = "URL set";

    };

}]);
