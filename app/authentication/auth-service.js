/**
 * Created by iemam on 15/09/2015.
 */
'use strict';

function authService($http, $q, $window, localStorageService, userSession, ngAppConfig){

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

        $http.post(serviceBase + 'accounts/register', registration)
            .success(function (response) {
                console.log("Inside http post success")
                deferred.resolve(response);
            })

            .error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

        return deferred.promise;

    };

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + encodeURIComponent(loginData.userName) + "&password=" + encodeURIComponent(loginData.password);
        //console.log(data)
        console.log(serviceBase + 'token');

        return $http({
            url:serviceBase + 'token',
            method:'POST',
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            function (response) {
                var result = response.data;
                console.log(result);
                if(result.token_result === "success" ){
                    var claims = getTokenCalims(result.access_token);
                    localStorageService.set('authorizationTFAData', { token: result.access_token, userName: loginData.userName});

                    _authentication.isAuth = true;
                    _authentication.userName = loginData.userName;
                    userSession.create(claims);
                    return result.user
                }
                else
                    throw result;

            },
            function (httpError) {
                // translate the error
                throw httpError.status + " : " +
                httpError.data;
            });



        /*var deferred = $q.defer();

        $http.post(serviceBase + 'token',
            data,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded'
            } })
            .success(function (response) {

                //console.log(response);

                var claims = getTokenCalims(response.access_token);
                //console.log(claims)
                localStorageService.set('authorizationTFAData', { token: response.access_token, userName: loginData.userName});

                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;


                userSession.create(claims);
                //return res.data.user;

                deferred.resolve(response.user);

            }).error(function (err, status) {
                //console.log(err);
                _logOut();
                deferred.reject(err);
            });

        return deferred.promise;
*/
    };

    var _logOut = function () {

        var deferred = $q.defer();
        localStorageService.remove('authorizationTFAData');

        _authentication.isAuth = false;
        _authentication.userName = "";
        deferred.resolve(_authentication);
        return deferred.promise;
    };

    var getTokenCalims = function(token){
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-','+').replace('_','/');
        return JSON.parse($window.atob(base64));

    };

    var _getCurrentUser = function(){

        return $http({
            url: serviceBase + 'accounts/currentuser',
            method: 'GET'
        }).then(
            function (response) {
                return {
                    user: (response.data.result)
                }
            }
        );
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
    authServiceFactory.getCurrentUser = _getCurrentUser;
    authServiceFactory.authentication = _authentication;


    return authServiceFactory;
}

angular
    .module('bioSpeak.userAuth')
    .factory('authService',['$http', '$q', '$window','localStorageService','userSession', 'ngAppConfig', authService])
//.controller('MainCtrl, ['$scope', 'SomeFactory', MainCtrl]);

