/**
 * Created by iemam on 10/09/2015.
 */
var app = angular.module('eTRIKSdata.userAuth', []);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('login',{
            url: "/login",
            templateUrl:"authentication/login.html"
        })

        .state('signup',{
            url: "/signup",
            templateUrl:"authentication/signup.html"
        })

/*    /!*$routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    });*!/

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });

    $routeProvider.when("/transhistory", {
        controller: "moneyTransController",
        templateUrl: "/app/views/transhistory.html"
    });

    $routeProvider.when("/transfermoney", {
        controller: "transferMoneyController",
        templateUrl: "/app/views/transferMoney.html"
    });


    $routeProvider.otherwise({ redirectTo: "/home" });*/

});

//var serviceBase = 'http://localhost:55435/';
//var serviceBase = 'https://ngtfaapi.azurewebsites.net/';
//app.constant('ngAuthSettings', {
//    apiServiceBaseUri: serviceBase
//});

//app.config(function ($httpProvider) {
//    $httpProvider.interceptors.push('authInterceptorService');
//});

//app.run(['authService', function (authService) {
//    authService.fillAuthData();
//}]);
