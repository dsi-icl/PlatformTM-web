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
                /*loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'authentication/auth-service.js','authentication/authInterceptor-service.js']);
                }],
                loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('authentication/login-controller.js');
                }],*/
                loadPlugin: ['$ocLazyLoad',function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lib/plugins/steps/jquery.steps.css','lib/plugins/iCheck/custom.css','lib/plugins/iCheck/icheck.min.js'
                    ]);
                }],
                loadPlugin2: ['$ocLazyLoad',function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'angular-ladda',
                            files: ['lib/plugins/ladda/js/spin.min.js', 'lib/plugins/ladda/js/ladda.min.js', 'lib/plugins/ladda/css/ladda-themeless.min.css','lib/plugins/ladda/js/angular-ladda.min.js']
                        }
                    ]);
                }]

            }
        })

        .state('signup',{
            url: "/signup",
            templateUrl:"authentication/signup.html",
            controller : "signupController",
            resolve:{
                /*loadService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('authentication/auth-service.js');
                }],
                loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('authentication/signup-controller.js');
                }],*/
            }
        })

    $httpProvider.interceptors.push('authInterceptorService');
}


angular
    .module('bioSpeak.userAuth')
    .config(config)

