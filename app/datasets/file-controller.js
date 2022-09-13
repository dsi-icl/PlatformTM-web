/**
 * Created by iemam on 06/10/2015.
 */
'use strict';


function datasetFileController($scope, $state, $stateParams, DTOptionsBuilder, $resource,wizardService){

    var activityId = $stateParams.activityId;
    var datasetId = $stateParams.datasetId;
    var fileId = 668;

    //$scope.$parent.wzCtrl.activityId = $stateParams.activityId;
    //$scope.$parent.wzCtrl.datasetId = $stateParams.datasetId;

    var vm = this;
    vm.params = {
        datasetId: datasetId,
        activityId:activityId,
        fileId: 668
    };

    vm.showDT= false;
    vm.dtColumns=[];

    wizardService.getDataTablePreview(fileId)
        .then(function(result){
            vm.dtColumns = result.tableHeader;
            vm.showDT = true;
            //vm.fileName = result.file.fileName;
            //vm.file = result.file;
            //vm.folders = result.folders;

        });

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
        return wizardService.getDataTableData();
    })
        .withPaginationType('simple')
        .withOption('scrollX', true);
}

angular.module('bioSpeak.datasets')
    .controller('datasetFileController',['$scope','$state','$stateParams','DTOptionsBuilder','$resource','wizardService', datasetFileController]);