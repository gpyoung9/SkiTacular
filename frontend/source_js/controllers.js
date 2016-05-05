var AppControllers = angular.module('AppControllers', []);

AppControllers.controller('homeController', ['$scope', 'CommonData', function ($scope, CommonData) {
    $scope.data = "";
    $scope.displayText = "";


    $scope.setData = function () {
        CommonData.setData($scope.data);
        $scope.displayText = "Data set"
    };
}]);

AppControllers.controller('mainController', ['$scope', 'CommonData', 'UserService', function ($scope, CommonData, UserService) {
    $scope.data = {};
    $scope.displayText = "";
    $scope.login_status = CommonData.get_login();

    $scope.formData = {};


    $scope.setData = function () {
        CommonData.setData($scope.data);
        $scope.displayText = "Data set"

    };

    $scope.joinus = function () {
        $scope.username = document.getElementById('username').value;
        $scope.password = document.getElementById('password').value;
        $scope.zipcode = document.getElementById('zipcode').value;
        console.log($scope.username);

        data = {
            "email": $scope.username,
            "password": $scope.password,
            "zipcode": $scope.zipcode
        };

        UserService.post_service("signup", data, function (data) {
            $scope.user = data;
            console.log(data);
            if(data=="Unauthorized"){
                 el = document.getElementById('username_exists');
                el.style.display = "block";
                console.log("nah fam");
            }
            else{
                el = document.getElementById('username_exists');
                el.style.display = "none";
            }

        });


        CommonData.signup($scope.username, $scope.password, $scope.zipcode);
    };

    $scope.login = function () {
        $scope.username = document.getElementById('username').value;
        $scope.password = document.getElementById('password').value;
        $scope.zipcode = document.getElementById('zipcode').value;
        console.log("login attempt");


        data = {
            "email": $scope.username,
            "password": $scope.password,
        };

        UserService.post_service("login", data, function (data) {
            $scope.user = data;
            console.log(data);
            if(data=="Unauthorized"){
                el = document.getElementById('invalid_login');
                el.style.display = "block";
                console.log("nah fam");
            }
            else{
                el = document.getElementById('invalid_login');
                el.style.display = "none";
            }

        });


    };

}]);

AppControllers.controller('SecondController', ['$scope', 'CommonData', function ($scope, CommonData) {
    $scope.data = "";

    $scope.getData = function () {
        $scope.data = CommonData.getData();

    };

}]);

AppControllers.controller('detailsController', ['$scope', 'CommonData', '$routeParams', 'ResortService', function ($scope, CommonData, $routeParams, ResortService) {

    var query = 'resorts?where={"_id":"' + $routeParams.id + '"}';

    ResortService.get_service(query, function (data) {
        console.log(data);
        $scope.resort = data[0];
    });

    $scope.mountainName = "Sunapee";

}]);


AppControllers.controller('functionController', ['$scope', '$http', '$window', 'ResortService', 'Pagination', 'CommonData', function ($scope, $http, $window, ResortService, Pagination, CommonData) {

    $scope.search_parameter = "";
    $scope.hidePagination = true;
    $scope.zipcode = "";

    /**
     * If already searched, use the history as a temporary solution.
     */
    if (CommonData.get_search_status()) {
        $scope.search_result = CommonData.get_search_data();
        $scope.pagination = Pagination.getNew(16);
        $scope.pagination.numPages = Math.ceil($scope.search_result.length / $scope.pagination.perPage);
    }


    /**
     * Price slider parameters
     * @type {{minValue: number, maxValue: number, options: {ceil: number, floor: number, showTicksValues: boolean}}}
     */
    $scope.price_slider = {
        minValue: 50,
        maxValue: 50000,
        options: {
            ceil: 50000,
            floor: 0,
            step: 10,
            showTicksValues: false,
            getSelectionBarColor: function (value) {
                return '#7A9D96'
            },
            getPointerColor: function (value) {
                return '#7A9D96'
            }
        }
    };

    /**
     * Distance slider parameters
     * @type {{minValue: number, maxValue: number, options: {ceil: number, floor: number, showTicksValues: boolean}}}
     */
    $scope.distance_slider = {
        minValue: 100,
        maxValue: 3000,
        options: {
            ceil: 3000,
            floor: 0,
            step: 100,
            showTicksValues: false,
            getSelectionBarColor: function (value) {
                return '#7A9D96'
            },
            getPointerColor: function (value) {
                return '#7A9D96'
            }
        }
    };


    $scope.p_t = {
        minValue: 10,
        maxValue: 60,
        options: {
            ceil: 100,
            floor: 0,

            step: 1,
            showTicksValues: false,
            getSelectionBarColor: function (value) {
                return '#7A9D96'
            },
            getPointerColor: function (value) {
                return '#7A9D96'
            }
        }
    };


    /**
     * When pressing the search button, this function will be triggered
     * ?where={ Price: { $gt: 200, $lt: 400 }, Distance:  { $gt: 200, $lt: 400 } }
     */

    $scope.search = function () {
        zipcode_request = "distances/" + $scope.zipcode;
        $scope.hidePagination = false;
        var get_request = "resorts?where={ Price: { $gt:" + $scope.price_slider.minValue.toString() + ", $lt:"
            + $scope.price_slider.maxValue.toString() + "}, Percent_trails_open: { $gt:" + ($scope.p_t.minValue / 100).toString() + ", $lt:"
            + ($scope.p_t.maxValue / 100).toString() + "}, Distance:  { $gt: "
            + $scope.distance_slider.minValue.toString() + ", $lt:"
            + $scope.distance_slider.maxValue.toString() + '},"name": {$regex:"' + $scope.search_parameter + '"}}';



        console.log(get_request)
        ResortService.put_service(zipcode_request, function () {
            ResortService.get_service(get_request, function (data) {
                $scope.search_result = data;
                CommonData.set_search_status();
                CommonData.set_search_data(data);

                console.log($scope.search_result);
                $scope.pagination = Pagination.getNew(16);
                $scope.pagination.numPages = Math.ceil($scope.search_result.length / $scope.pagination.perPage);
            })
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
