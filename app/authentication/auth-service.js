/**
 * Created by iemam on 15/09/2015.
 */
'use strict';

function authService($http, $q, $window, localStorageService, userSession, ngAppConfig){

    var serviceBase = ngAppConfig.apiServiceBaseUri;
    var authServiceFactory = {};

    var _saveRegistration = function (registration) {
        var deferred = $q.defer();

        $http.post(serviceBase + 'accounts/register', registration)
            .success(function (response) {
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
        return $http({
            url:serviceBase + 'token',
            method:'POST',
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            function (response) {
                var result = response.data;
                if(result.token_result === "success" ){
                    var claims = _getTokenClaims(result.access_token);
                    var user = userSession.create(result.user,result.access_token,claims);
                    return result.user
                }
                else
                    throw result;

            },
            function (httpError) {
                console.log("error resp",httpError)
                // translate the error
                throw httpError.status + " : " +
                httpError.data;
            });
    };

    var _logOut = function () {
        return $http({
            url: serviceBase + 'accounts/logout',
            method: 'GET'
        }).then(
            function (response) {
                // Destroy session in the browser
                userSession.destroy();
            })
    };

    var _isLoggedIn = function(){
        return userSession.getUser() !== null;
    };

    var _getTokenClaims = function(token){
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

    var _checkPermissionForView = function(view, params) {
        if (!view.data || !view.data.requiresAuthentication) {
            return true;
        }

        return _userHasPermissionForView(view,params);
    };

    var _userHasPermissionForView = function(view,params){
        if(!_isLoggedIn()){
            return false;
        }

        if(!view.data || !view.data.permissions.length){
            return true;
        }

        console.log(view,params);
        var projectId;
        if(params.projectId)
            projectId = params.projectId;

        return _userHasPermission(view.data.permissions,projectId);
    };

    var _userHasPermission = function(permissions,projectId){
        if(!_isLoggedIn()){
            return false;
        }

        var found = false;


        console.log('checking permissions for ', permissions);
        console.log('user claims are',userSession.getUserClaims() )

        if(angular.isArray(permissions)){
            angular.forEach(permissions, function(permission, index){
                if(projectId)
                    permission = permission+"-"+projectId;
                console.log('looking for ',permission,'in', userSession.getUserClaims())
                if (userSession.getUserClaims().indexOf(permission) >= 0){
                    found = true;
                    return;
                }
            });
        }
        if(angular.isString(permissions)){
            if(projectId)
                permissions = permissions+"-"+projectId;
            console.log('looking for ',permissions,'in', userSession.getUserClaims())
            if (userSession.getUserClaims().indexOf(permissions) >= 0){
                found = true;
                return found;
            }
        }


        return found;
    };

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.getCurrentUser = _getCurrentUser;
    authServiceFactory.checkPermissionForView = _checkPermissionForView;
    authServiceFactory.userHasPermission = _userHasPermission;


    return authServiceFactory;
}

angular
    .module('bioSpeak.userAuth')
    .factory('authService',['$http', '$q', '$window','localStorageService', 'userSession', 'ngAppConfig', authService])
