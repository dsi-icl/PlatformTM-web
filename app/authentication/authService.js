/**
 * Created by iemam on 15/09/2015.
 */
'use strict';

function authService($http, $q, localStorageService, ngAppConfig){

//app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', function ($http, $q, localStorageService, ngAuthSettings) {

    var serviceBase = ngAppConfig.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        firstName: "",
        lastName: ""
    };


    var _saveRegistration = function (registration) {

        //_logOut();

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/accounts/signup', registration)
            .success(function (response) {
                console.log("Inside http post succes")
                deferred.resolve(response);
            })

            .error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

        return deferred.promise;

    };

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
        console.log(data)
        console.log(serviceBase + 'token')

        var deferred = $q.defer();

        $http.post(serviceBase + 'token',
            data,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded',
                         'Access-Control-Allow-Origin' : 'http://localhost:63342'
            } })
            .success(function (response) {

                console.log(response);

                localStorageService.set('authorizationTFAData', { token: response.access_token, userName: loginData.userName});

                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;

                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

        return deferred.promise;

    };

    var _logOut = function () {

        var deferred = $q.defer();
        localStorageService.remove('authorizationTFAData');

        _authentication.isAuth = false;
        _authentication.userName = "";
        deferred.resolve(_authentication);
        return deferred.promise;
    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationTFAData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
        }

    };

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;


    return authServiceFactory;
}

angular
    .module('bioSpeak.userAuth')
    .factory('authService',['$http', '$q', 'localStorageService', 'ngAppConfig', authService])
//.controller('MainCtrl, ['$scope', 'SomeFactory', MainCtrl]);

