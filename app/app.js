//'use strict';


// Declare app level module which depends on filters, and services
var eTRIKSdataApp = angular.module('eTRIKSdata', [
        "bioSpeak.layout",
        "ui.router",
        "eTRIKSdata.studyDesign",
        "eTRIKSdata.explorer",
        "eTRIKSdata.loader",
        "eTRIKSdata.mapper",
        "bioSpeak.userAuth",
        "bioSpeak.fileManager"
    ]);

eTRIKSdataApp.config(function($stateProvider, $urlRouterProvider){

       /*$urlRouterProvider.otherwise('/home');*/

    //$urlRouterProvider.when('', '/explore/P-BVS}');
    $urlRouterProvider.when('', '/login');

    $stateProvider

        .state('main',{
            abstract:true,
            url: "/main",
            templateUrl:"layout/content.html"
        })
        .state('main.home',{
            url: "/home",
            templateUrl:"home.html"
        })
        .state('main.dashboard',{
            url: "/landing",
            templateUrl:"home.html"
        })




    });
