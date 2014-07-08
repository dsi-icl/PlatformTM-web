//'use strict';


// Declare app level module which depends on filters, and services
var eTRIKSdataApp = angular.module('eTRIKSdata', [
        "ui.router",
        "eTRIKSdata.studyDesign",
        "eTRIKSdata.explorer"
    ]);

eTRIKSdataApp.config(function($stateProvider, $urlRouterProvider){

       $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home',{
                url: "/home",
                templateUrl:"home.html"
            })

    });
