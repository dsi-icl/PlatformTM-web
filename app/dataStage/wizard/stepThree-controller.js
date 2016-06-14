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

    $scope.vm = {
        datasetId: $stateParams.datasetId,
        activityId:$stateParams.activityId,
        standardFileId: $stateParams.standardFileId,
        //map: $stateParams.map,
        showDT: false,
        dtColumns:[]
    }



    //$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    //$scope.vm.dtOptions = DTOptionsBuilder.fromSource(res.data);//res.data//$resource('/angular-datatables/dtOptions.json').get().$promise;
    //$scope.vm.dtColumns = wizardService.getDTheader();

    //$scope.vm.dtColumns = res.header//wizardService.getDataTablePreview($scope.vm.fileName,$scope.vm.map).$promise

    wizardService.getDataTablePreview($scope.vm.datasetId, $scope.vm.standardFileId)
        .then(function(headers){
            //console.log(headers)
            $scope.vm.dtColumns = headers;
            $scope.vm.showDT = true
        })

    $scope.goToStep2 = function(){
        $state.go('datastage.wizard.step_two',{ activityId: $scope.vm.activityId, datasetId: $scope.vm.datasetId, standardFileId: $scope.vm.standardFileId });
    }
    $scope.goToStep4 = function(){
        $state.go('datastage.wizard.step_four',{ activityId: $scope.vm.activityId, datasetId: $scope.vm.datasetId, standardFileId: $scope.vm.standardFileId });
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
        .withOption('scrollX', true)
        //res.header////$resource('/angular-datatables/dtColumns.json').query().$promise;
    //$scope.vm.dtColumns = $resource('../data/dtColumns.json').query().$promise;



    /*$scope.vm.dtOptions = DTOptionsBuilder.fromSource('../data/dt.json')
        .withDataProp('data').withPaginationType('full_numbers')*/

    //wizardService.getDataTablePreview($scope.vm.fileName,$scope.vm.map).then(function(dataAndHeader){
    //    //$scope.vm.dt = datatable
    //
    //    /*vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
    //        return $resource('data.json').query().$promise;
    //    }).withPaginationType('full_numbers');*/
    //
    //
    //
    //    $scope.vm.dtOptions = res.data//$resource('/angular-datatables/dtOptions.json').get().$promise;
    //
    //
    //
    //
    //
    //
    //    console.log($scope.vm.dtOptions);
    //    console.log($scope.vm.dtColumns);
    //
    // });

}

angular.module('bioSpeak.import')
    .controller('stepThreeController',['$scope','$state','$stateParams','DTOptionsBuilder','$resource','wizardService', stepThreeController]);