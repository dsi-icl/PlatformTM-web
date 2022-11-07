function DatasetListCtrl($scope, $state, $stateParams, projService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;

    // datasetService.getUserDatasets().then(function(datasets){
    //     vm.datasets = datasets;
    //     vm.loaded = true;
    // });

    projService.getProjectClinicalDatasets(vm.projectId).then(function (response) {
        vm.clinicalDatasets = response;
        vm.cdsLoaded = true;
    });
}

angular.module('bioSpeak.datasets')
    .controller('DatasetListCtrl', ['$scope', '$state', '$stateParams', 'projService', DatasetListCtrl]);