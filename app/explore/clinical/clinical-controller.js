/**
 * Created by iemam on 06/05/2015.
 */
'use strict'
function ClinicalController($scope,$stateParams,clinicalDataService,ClinicalCf,DCchartingService, filtersService){

    $scope.vm = {};
    $scope.vm.show = 'plots';


    //TEMP
    $scope.cf = ClinicalCf;
    $scope.chartservice = DCchartingService;
    //////////////////////
    

    $scope.chartingOpts = {
        projectId : $stateParams.projectId,
        chartContainerId : "clinical-plots",
        chartGroup : "clinical",
        DCchartService : "DCchartingService",
        xfilterService : "ClinicalCf",
        filtersService: "filtersService"
    };


    console.log("calling clinical tree")
    clinicalDataService.getClinicalDataTree($scope.chartingOpts.projectId)
        .then(function(data){
            //console.log("back")
            $scope.clinicalObservations = data.treeData;
            //console.log($scope.clinicalObservations)
            //$scope.getObsForAll();

        })

}
angular.module('biospeak.explorer')
    .controller('ClinicalCtrl', ['$scope','$stateParams','clinicalDataService','ClinicalCf','DCchartingService',
        'filtersService',ClinicalController])



