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

    vm.downloadDescriptor = function(dataset){
        dataset.descriptorloading=true;
        projService.downloadDatasetDescriptor(dataset.id).then(function (response) {
            //dataset.deschref = response.url;
            //dataset.descfilename = response.filename;//dataset.name+".csv";
            //dataset.descriptorloading=false;
            //dataset.descriptorready = true;
            //console.log(response)
            var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response));
            var downloader = document.createElement('a');

            downloader.setAttribute('href', data);
            downloader.setAttribute('download', 'file.json');
            downloader.click();
        });
    }
}

angular.module('bioSpeak.projectHome')
    .controller('ProjectSummaryCtrl',['$scope','$state','$stateParams','projService',ProjectSummaryCtrl]);