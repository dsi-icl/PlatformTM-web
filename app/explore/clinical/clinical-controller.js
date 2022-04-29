/**
 * Created by iemam on 06/05/2015.
 */
'use strict'
function ClinicalController($scope,$stateParams,clinicalDataService,ClinicalXF,DCchartingService){

    $scope.vm = {};
    $scope.vm.show = 'plots';
    $scope.vm.ready = false;


    $scope.chartingOpts = {
        projectId : $stateParams.projectId,
        //chartContainerId : "clinical-plots",
        chartGroup : "clinical",
        DCchartService : "DCchartingService",
        xfilterService : "ClinicalXF",
        filtersService: "filtersService",
        clinicalDataService: "clinicalDataService"
    };


    clinicalDataService.getClinicalDataTree($scope.chartingOpts.projectId)
         .then(function(data){
             $scope.clinicalObservations = data.treeData;
             $scope.vm.ready = true;
         })


}
angular.module('biospeak.explorer')
    .controller('ClinicalCtrl', ['$scope','$stateParams','clinicalDataService','ClinicalXF','DCchartingService',ClinicalController])



