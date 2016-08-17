/**
 * Created by iemam on 06/10/2015.
 */
'use strict';

/*function WithPromiseCtrl(DTOptionsBuilder, DTColumnBuilder, $resource) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        return $resource('data.json').query().$promise;
    }).withPaginationType('full_numbers');

    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
}*/

function stepThreeController($scope, $state, $stateParams, DTOptionsBuilder, $resource,wizardService){

    var activityId = $stateParams.activityId;
    var datasetId = $stateParams.datasetId;
    var fileId = $stateParams.fileId;

    $scope.vm = {
        datasetId: datasetId,
        activityId:activityId,
        fileId: fileId,
        //map: $stateParams.map,
        showDT: false,
        dtColumns:[]
    }



    //$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    //$scope.vm.dtOptions = DTOptionsBuilder.fromSource(res.data);//res.data//$resource('/angular-datatables/dtOptions.json').get().$promise;
    //$scope.vm.dtColumns = wizardService.getDTheader();

    //$scope.vm.dtColumns = res.header//wizardService.getDataTablePreview($scope.vm.fileName,$scope.vm.map).$promise

    wizardService.getDataTablePreview($scope.vm.datasetId, $scope.vm.fileId)
        .then(function(headers){
            //console.log(headers)
            $scope.vm.dtColumns = headers;
            $scope.vm.showDT = true
        })

    $scope.goToStep2 = function(){
        $state.go('datastage.wizard.step_two',{ activityId: $scope.vm.activityId, datasetId: $scope.vm.datasetId, fileId: fileId });
    }
    $scope.goToStep4 = function(){
        $state.go('datastage.wizard.step_four',{ activityId: $scope.vm.activityId, datasetId: $scope.vm.datasetId, fileId: fileId });
    }

    $scope.vm.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
        return wizardService.getDataTableData()
        //return $resource('../data/dt.json').query().$promise;
    })
        .withTableTools('lib/plugins/dataTables/copy_csv_xls_pdf.swf')
        .withTableToolsButtons([
            'copy',
            'print', {
                'sExtends': 'collection',
                'sButtonText': 'Save',
                'aButtons': ['csv', 'xls', 'pdf']
            }
        ])
        .withPaginationType('simple')
        .withOption('scrollX', true);

}

angular.module('bioSpeak.import')
    .controller('stepThreeController',['$scope','$state','$stateParams','DTOptionsBuilder','$resource','wizardService', stepThreeController]);