function DatasetListCtrl($scope, $state, $stateParams, datasetService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;

    // datasetService.getUserDatasets().then(function(datasets){
    //     vm.datasets = datasets;
    //     vm.loaded = true;
    // });

    datasetService.getPrimaryDatasetResource.getAllProjectDatasets({projectId:vm.projectId},function (response) {
        vm.datasets = response;
        vm.cdsLoaded = true;
    });
}

angular.module('bioSpeak.datasets')
    .controller('DatasetListCtrl', ['$scope', '$state', '$stateParams', 'datasetService', DatasetListCtrl]);