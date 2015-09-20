/**
 * Created by iemam on 10/09/2015.
 */

(function () {
    angular.module('bioSpeak.userAuth', ['ui.router','LocalStorageModule'])

    /*app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);*/


})();


function config($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider
        .state('login',{
            url: "/login",
            templateUrl: "authentication/login.html",
            controller: "loginController"
        })

        .state('signup',{
            url: "/signup",
            templateUrl:"authentication/signup.html",
            controller : "signupController"
        })

    $httpProvider.interceptors.push('authInterceptorService');
}


angular
    .module('bioSpeak.userAuth')
    .config(config)
    .constant('ngAuthSettings', {
        apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
    })
