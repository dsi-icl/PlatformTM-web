//'use strict';


// Declare app level module which depends on filters, and services
var eTRIKSdataApp = angular.module('eTRIKSdata', [
    "ui.bootstrap",
    "toaster", "ngAnimate",
    "ui.router",
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

    //$urlRouterProvider.when('', '/explore/P-BVS}');
    $urlRouterProvider.when('', '/login');
    $urlRouterProvider.when('/home', '/admin/projects');
    //$urlRouterProvider.when('main.home', 'admin.projects');


    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: true
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



})

eTRIKSdataApp.constant('ngAppConfig', {
    apiServiceBaseUri: 'http://ehs.biospeak.solutions/sandbox/'
    //apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
    //apiServiceBaseUri: 'http://155.198.188.216:2483/'
})
