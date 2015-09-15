//'use strict';


// Declare app level module which depends on filters, and services
var eTRIKSdataApp = angular.module('eTRIKSdata', [
        "ui.router",
        "eTRIKSdata.studyDesign",
        "eTRIKSdata.explorer",
        "eTRIKSdata.loader",
        "eTRIKSdata.mapper"
    ]);

eTRIKSdataApp.config(function($stateProvider, $urlRouterProvider){

       /*$urlRouterProvider.otherwise('/home');*/

    $urlRouterProvider.when('', '/home');
        $stateProvider
            .state('home',{
                url: "/home",
                templateUrl:"home.html"
            })



    });


eTRIKSdataApp.controller('theController',['$scope',function($scope){
    $scope.items=[];
    $scope.addItem=function(){
        for(i=9;i--;){
            $scope.items.push({'title':'item:'+i})
        }
    };
    $scope.removeItem=function(index){
        $scope.items.splice(index,1)
    };
    $scope.clear=function(){
        $scope.items=[];
    };
}]);

