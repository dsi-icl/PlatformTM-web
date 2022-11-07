'use strict';
function DatasetCtrl($scope, $state, $stateParams, datasetService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.datasetId = $stateParams.datasetId;


    // datasetService.getUserDatasets().then(function(datasets){
    //     vm.datasets = datasets;
    //     vm.loaded = true;
    // });



    vm.plotSwitchClicked = function (var1, var2) {
        //plot functionality....
    }

    datasetService.getDataSet(vm.datasetId)
        .then(function (data) {
            console.log("retrieved dataset", data)
            vm.datasetInfo = data;
        })








}

angular.module('bioSpeak.datasets')
    .controller('DatasetCtrl', ['$scope', '$state', '$stateParams', 'datasetService', DatasetCtrl]);