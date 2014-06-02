//'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
        "ui.router",
        "myApp.controllers",
        "nvd3ChartDirectives"
    ]);

myApp.config(function($stateProvider, $urlRouterProvider){

       $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: "",
                views:{
                    'subjects':{
                        templateUrl: 'partials/study_subjects.html',
                        controller: 'SubjectsCtrl'
                    },
                    'assessments':{
                        templateUrl: 'partials/study_clinical.html',
                        controller: 'ClinicalCtrl'
                    },
                    'assays':{
                        templateUrl: 'partials/study_assays.html',
                        controller: 'AssayCtrl'
                    },
                    'design':{
                        templateUrl: 'partials/study_design.html'
                    }
                }

            })
    });
//    .
//config(['$routeProvider', function($routeProvider) {
//  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
//  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
//  $routeProvider.otherwise({redirectTo: '/view1'});
//}]);
