/**
 * Created by iemam on 06/05/2015.
 */
'use strict'
//function ClinicalController($scope, $stateParams, clinicalDataService, ClinicalXF, DCchartingService) {
function ClinicalController($scope, $stateParams, clinicalDataService) {
    $scope.vm = {};
    $scope.vm.show = 'plots';
    $scope.vm.ready = false;


    $scope.chartingOpts = {
        datasetId: $stateParams.datasetId,
        //chartContainerId : "clinical-plots",
        chartGroup: "clinical",
        DCchartService: "DCchartingService",
        xfilterService: "DatasetXF",
        filtersService: "filtersService",
        clinicalDataService: "clinicalDataService"
    };

    console.log($stateParams.datasetId)

    // clinicalDataService.getFeatures($stateParams.datasetId),function(response){
    //     console.log(response)
    // }

    clinicalDataService.getClinicalDataTree($stateParams.datasetId)
        .then(function (data) {
            //console.log("retrieved clinical data", data)
            $scope.clinicalObservations = data.treeData;
            $scope.vm.ready = true;
        })


}
angular.module('bioSpeak.datasets')
    .controller('ClinicalCtrl', ['$scope', '$stateParams', 'clinicalDataService', ClinicalController])



