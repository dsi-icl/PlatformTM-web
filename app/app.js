//'use strict';


// Declare app level module which depends on filters, and services
var eTRIKSdataApp = angular.module('eTRIKSdata', [
    "ui.bootstrap",
    "toaster", "ngAnimate",
    "ui.router","ngSanitize",
    'oc.lazyLoad',
    'LocalStorageModule',                  // ocLazyLoad
    "bioSpeak.layout",
    "bioSpeak.config",
    "biospeak.explorer",
    "bioSpeak.userAuth",
    "bioSpeak.DataStager",
    "bioSpeak.import",
    "bioSpeak.export"
]);

eTRIKSdataApp.config(function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider){

    $urlRouterProvider.otherwise('/admin/projects');

    $urlRouterProvider.when('', '/login');
    $urlRouterProvider.when('/home', '/admin/projects');


    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('main',{
            abstract:true,
            url: "",
            templateUrl:"layout/content.html",
            controller:"logOutController"
        })
        .state('main.home',{
            url: "/admin/projects",
            //templateUrl:"admin/project/project-list.html"
            /*templateUrl:"dashboard/dashboard.html"*/
        })
        .state('main.landing',{
            url: "/dashboard",
            templateUrl:"../temp/home.html"
        })
});

eTRIKSdataApp.run(function($rootScope){
    $rootScope.$on('$stateChangeSuccess', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
});

eTRIKSdataApp.constant('ngAppConfig', {
     // apiServiceBaseUri: '/api/v1/'
    //apiServiceBaseUri: 'http://ehs.biospeak.solutions/api/v1/'
    //apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
    apiServiceBaseUri: 'http://146.169.15.65:2483/'
});
