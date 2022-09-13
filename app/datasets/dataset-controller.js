'use strict';
function DatasetCtrl($scope,$state,$stateParams,datasetService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;


    // datasetService.getUserDatasets().then(function(datasets){
    //     vm.datasets = datasets;
    //     vm.loaded = true;
    // });










}

angular.module('bioSpeak.datasets')
    .controller('DatasetCtrl',['$scope','$state','$stateParams','datasetService',DatasetCtrl]);