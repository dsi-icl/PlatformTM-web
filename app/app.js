//'use strict';


// Declare app level module which depends on filters, and services
var eTRIKSdataApp = angular.module('eTRIKSdata', [
        "bioSpeak.layout",
        "ui.router",
        'oc.lazyLoad',
        'LocalStorageModule',                  // ocLazyLoad
        "eTRIKSdata.studyDesign",
        "eTRIKSdata.explorer",
        "bioSpeak.userAuth",
        "bioSpeak.DataStager",
        "bioSpeak.import"
    ]);

eTRIKSdataApp.config(function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider){

       $urlRouterProvider.otherwise('/home');

    //$urlRouterProvider.when('', '/explore/P-BVS}');
    $urlRouterProvider.when('', '/home');

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
            url: "/home",
            templateUrl:"landing/dashboard.html"
        })
        .state('main.landing',{
            url: "/landing",
            templateUrl:"../temp/home.html"
        })




    });

eTRIKSdataApp.run(function($rootScope){
    $rootScope.$on('$stateChangeSuccess', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
})

eTRIKSdataApp.constant('ngAppConfig', {
    //apiServiceBaseUri: 'http://ehs.biospeak.solutions/sandbox/'
    apiServiceBaseUri: 'http://rachmaninoff.local:8080/'
})
