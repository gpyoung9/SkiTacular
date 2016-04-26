var AppServices = angular.module('AppServices', []);

AppServices.factory('CommonData', function () {
    var data = "";
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

