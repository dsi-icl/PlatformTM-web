/**
 * Created by iemam on 10/09/2015.
 */

(function () {
    angular.module('bioSpeak.userAuth', ['ui.router'])

    /*app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);*/


})();


function config($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider
        .state('login',{
            url: "/login",
            templateUrl: "authentication/login.html",
            controller: "loginController",
            resolve: {
                loadPlugin: ['$ocLazyLoad',function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lib/plugins/steps/jquery.steps.css','lib/plugins/iCheck/custom.css','lib/plugins/iCheck/icheck.min.js'
                    ]);
                }]
            }
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

