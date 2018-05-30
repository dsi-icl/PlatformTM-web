/**
 * Created by iemam on 15/09/2015.
 */
'use strict';
function authInterceptorService($q,$rootScope,AUTH_EVENTS,userSession){
    var authInterceptorServiceFactory = {};

    //var redirectUrl;

    var _request = function (config) {
        config.headers = config.headers || {};
        var token = userSession.getAccessToken();
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    };

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            if ((rejection.data.code) && (rejection.data.code = 100))
            {
                //Case that OTP is not valid but access token is valid
                return $q.reject(rejection);
            }
            console.log("401");
            userSession.destroy();
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
        return $q.reject(rejection);
    };

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}

angular
    .module('bioSpeak.userAuth')
    .factory('authInterceptorService',['$q','$rootScope','AUTH_EVENTS','userSession',authInterceptorService])



