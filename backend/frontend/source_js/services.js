var AppServices = angular.module('AppServices', []);

AppServices.factory('CommonData', function () {
    var data = "http://localhost:4000/api/";
    var login_status = false;
    var search_result = [];
    var user = {};
    var search_status = false;
    return {
        getData: function () {
            return data;
        },
        setData: function (newData) {
            data = newData;
        },
        signup: function (userObject) {
            console.log(userObject);
            login_status = true;
            user = userObject;
        },
        login: function (userObject) {
            login_status = true;
            user = userObject;
        },
        get_user: function () {
            return user;
        },
        logout: function () {
            login_status = false;
            user = {};
        },
        get_login: function () {
            return login_status;
        },
        get_search_status: function () {
            return search_status;
        },
        set_search_status: function () {
            search_status = true;
        },
        set_search_data: function (data) {
            search_result = data;
        },
        get_search_data: function () {
            return search_result;
        }


    }
});

AppServices.factory('ResortService', ['$http', 'CommonData', function ($http, CommonData) {
    return {
        get_service: function (select, callback) {
            $http.get(CommonData.getData() + select)
                .success(function (data) {
                    callback(data.data)
                })
                .error(function (data) {
                    callback(null)
                });
        },

        delete_service: function (delete_call, callback) {
            $http.delete(CommonData.getData + delete_call)
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
                url: CommonData.getData() + post_call,
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

        put_service: function (put_call, callback) {
            $http({
                method: 'PUT',
                url: CommonData.getData() + put_call
                //  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                //  data: $.param(data_send)
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


AppServices.factory('UserService', ['$http', 'CommonData', function ($http, CommonData) {
    return {
        get_service: function (select, callback) {
            $http.get(CommonData.getData() + select)
                .success(function (data) {
                    callback(data.data)
                })
                .error(function (data) {
                    callback(null)
                });
        },

        delete_service: function (delete_call, callback) {
            $http.delete(CommonData.getData + delete_call)
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
                url: CommonData.getData() + post_call,
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
          post_service_fav: function (post_call, callback) {
            $http.post(CommonData.getData() + post_call)
                .success(function (data) {
                    callback(data.data)
                })
                .error(function (data) {
                    callback(null)
                });
        },

        put_service: function (put_call, callback) {
            $http({
                method: 'PUT',
                url: CommonData.getData() + put_call
                //  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                //  data: $.param(data_send)
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

