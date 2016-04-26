var AppServices = angular.module('AppServices', []);

AppServices.factory('CommonData', function () {
    var data = "http://localhost:4000/api/";
    var login_status = false;
    return {
        getData: function () {
            return data;
        },
        setData: function (newData) {
            data = newData;
        },
        login: function () {
            login_status = true;
        },
        logout: function () {
            login_status = false;
        },
        get_login: function () {
            return login_status;
        }

    }
});

AppServices.factory('ResortService', ['$http', 'CommonData', function ($http, CommonData) {
    return {
        get_service: function (select, callback) {
            $http.get(CommonData.getData() + "resorts?" + select)
                .success(function (data) {
                    callback(data.data)
                })
                .error(function (data) {
                    callback(null)
                });
        },

        delete_service: function (delete_call, callback) {
            $http.delete(CommonData.getData + "resorts?" + delete_call)
                .success(function (data) {
                    callback(data.data)
                })
                .error(function (data) {
                    callback(null)
                });
        },

        post_service: function (post_call, data_send, callback) {
            $http({
                method: 'POST',
                url: CommonData.getData() + "resorts?" + post_call,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $.param(data_send)
            })
                .success(function (response) {
                    callback(response)
                })
                .error(function (data) {
                    callback(data)
                })
        },

        put_service: function (put_call, data_send, callback) {
            $http({
                method: 'PUT',
                url: CommonData.getData() + "resorts?" + put_call,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $.param(data_send)
            })
                .success(function (response, status) {
                    callback(response, status)
                })
                .error(function (data, status) {
                    callback(data, status)
                })
        }
    }
}]);

