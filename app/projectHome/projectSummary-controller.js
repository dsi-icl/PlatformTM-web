'use strict';
function ProjectSummaryCtrl($scope,$state,$stateParams,projService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.ready = false;
    vm.cdsLoaded = false;
    vm.adsLoaded = false;

    projService.getProjectClinicalDatasets(vm.projectId).then(function (response) {
        vm.clinicalDatasets = response;
        vm.cdsLoaded = true;
    });

    projService.getProjectAssayDatasets(vm.projectId).then(function (response) {
        vm.assayDatasets = response;
        vm.adsLoaded = true;
    });


    vm.downloadDataset = function(dataset){
        dataset.loading=true;
        projService.downloadDataset(dataset.id).then(function (response) {
            dataset.href = response.url;
            dataset.filename = response.filename;//dataset.name+".csv";
            dataset.loading=false;
            dataset.ready = true;
            console.log(response)
        });
    }

}

angular.module('bioSpeak.projectHome')
    .controller('ProjectSummaryCtrl',['$scope','$state','$stateParams','projService',ProjectSummaryCtrl]);