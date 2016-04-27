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


AppControllers.controller('functionController', ['$scope', '$http', '$window', 'ResortService', 'Pagination', function ($scope, $http, $window, ResortService, Pagination) {

    $scope.search_parameter = "";

    /**
     * Price slider parameters
     * @type {{minValue: number, maxValue: number, options: {ceil: number, floor: number, showTicksValues: boolean}}}
     */
    $scope.price_slider = {
        minValue: 50,
        maxValue: 500,
        options: {
            ceil: 500,
            floor: 0,
            step: 10,
            showTicksValues: false
        }
    };

    /**
     * Distance slider parameters
     * @type {{minValue: number, maxValue: number, options: {ceil: number, floor: number, showTicksValues: boolean}}}
     */
    $scope.distance_slider = {
        minValue: 10,
        maxValue: 600,
        options: {
            ceil: 600,
            floor: 10,
            step: 10,
            showTicksValues: false
        }
    };

    /**
     * When pressing the search button, this function will be triggered
     * ?where={ Price: { $gt: 200, $lt: 400 }, Distance:  { $gt: 200, $lt: 400 } }
     */

    $scope.search = function () {

        get_request = "where={ Price: { $gt:" + $scope.price_slider.minValue.toString() + ", $lt:"
            + $scope.price_slider.maxValue.toString() + "}, Distance:  { $gt: "
            + $scope.distance_slider.minValue.toString() + ", $lt:"
            + $scope.distance_slider.maxValue.toString() + "} }";

        //console.log(get_request)
        ResortService.get_service(get_request, function (data) {
            $scope.search_result = data;

            //console.log($scope.search_result);
            $scope.pagination = Pagination.getNew(16);
            $scope.pagination.numPages = Math.ceil($scope.search_result.length / $scope.pagination.perPage);
        })
    }

}]);

AppControllers.controller('SettingsController', ['$scope', '$window', function ($scope, $window) {
    $scope.url = $window.sessionStorage.baseurl;

    $scope.setUrl = function () {
        $window.sessionStorage.baseurl = $scope.url;
        $scope.displayText = "URL set";

    };

}]);
