/**
 * Created by iemam on 08/07/2014.
 */
'use strict';
function ExplorerCtrl($scope,$state,$stateParams,SubjCf, assayDataService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.queryId = $stateParams.queryId;

    vm.chartingOpts = {
        projectId : $stateParams.projectId,
        chartContainerId : "subject-plots",
        subjChartGrp : "subject",
        DCchartService : "DCchartingService",
        subjectXFservice : "SubjCf",
        assayXFservice: "AssayCf",
        assayChartGrp: "assay",
        filtersService: "filtersService"

    };

    SubjCf.resetXF();
    $scope.assayDataService = assayDataService;


    $scope.$watch('assayDataService.assaysRetrieved()',function (assays) {
        //console.log(assays);
        if(assays && !vm.assays) {
            vm.assays = assays;
            //console.log(vm.assays);
        }
    },true);

}

/* Controllers */

angular.module('biospeak.explorer')
    .controller('ExplorerCtrl',['$scope','$state','$stateParams','SubjCf','assayDataService',ExplorerCtrl])
