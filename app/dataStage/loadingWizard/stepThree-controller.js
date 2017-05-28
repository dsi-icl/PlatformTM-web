/**
 * Created by iemam on 06/10/2015.
 */
'use strict';


function stepThreeController($scope, $state, $stateParams, DTOptionsBuilder, $resource,wizardService){

    var activityId = $stateParams.activityId;
    var datasetId = $stateParams.datasetId;
    var fileId = $stateParams.fileId;

    var vm = this;
    vm.params = {
        datasetId: datasetId,
        activityId:activityId,
        fileId: fileId
        //map: $stateParams.map,
    };

    vm.showDT= false;
    vm.dtColumns=[];

    wizardService.getDataTablePreview(vm.params.datasetId, vm.params.fileId)
        .then(function(headers){
            vm.dtColumns = headers;
            vm.showDT = true
        });

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
        return wizardService.getDataTableData();
    })
        //.withTableTools('lib/plugins/dataTables/copy_csv_xls_pdf.swf')
        // .withTableToolsButtons([
        //     'copy',
        //     'print', {
        //         'sExtends': 'collection',
        //         'sButtonText': 'Save',
        //         'aButtons': ['csv', 'xls', 'pdf']
        //     }
        // ])
        .withPaginationType('simple')
        .withOption('scrollX', true);

    vm.goToStep2 = function(){
        $state.go('datastage.wizard.step_two',{ activityId: vm.params.activityId, datasetId: vm.params.datasetId, fileId: vm.params.fileId });
    };
    vm.goToStep4 = function(){
        $state.go('datastage.wizard.step_four',{ activityId: vm.params.activityId, datasetId: vm.params.datasetId, fileId: vm.params.fileId });
    };
}

angular.module('bioSpeak.import')
    .controller('stepThreeController',['$scope','$state','$stateParams','DTOptionsBuilder','$resource','wizardService', stepThreeController]);