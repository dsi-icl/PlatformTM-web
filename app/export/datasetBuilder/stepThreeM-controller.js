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

function stepThreeControllerM($scope, $state, $stateParams,datasetService){

    //$scope.vm = {
    //    datasetId: $stateParams.datasetId,
    //    activityId:$stateParams.activityId,
    //    standardFileId: $stateParams.standardFileId,
    //    map: $stateParams.map,
    //    showDT: false,
    //    dtColumns:[]
    //}

    var vm = this;
    vm.dataLoaded = false;
    vm.dtColumns = [];
    vm.show = 'tree';
    //$scope.vm = {
    //    dataLoaded : false,
    //    dtColumns :[]
    //}
    var projectId = $stateParams.studyId;



    //$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    //$scope.vm.dtOptions = DTOptionsBuilder.fromSource(res.data);//res.data//$resource('/angular-datatables/dtOptions.json').get().$promise;
    //$scope.vm.dtColumns = wizardService.getDTheader();

    //$scope.vm.dtColumns = res.header//wizardService.getDataTablePreview($scope.vm.fileName,$scope.vm.map).$promise
/*

    datasetService.previewData(projectId)
        .then(function(headers){
            console.log(headers)
            vm.dtColumns = headers;
            vm.dataLoaded = true
        })
*/


    /*vm.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
        return datasetService.getDataTableData()
        //return $resource('../data/dt.json').query().$promise;
    })
        //.withTableTools('lib/plugins/dataTables/copy_csv_xls_pdf.swf')
        //.withTableToolsButtons([
        //    'copy',
        //    'print', {
        //        'sExtends': 'collection',
        //        'sButtonText': 'Save',
        //        'aButtons': ['csv', 'xls', 'pdf']
        //    }
        //])
        .withPaginationType('simple')
        .withOption('scrollX', true)
        //res.header////$resource('/angular-datatables/dtColumns.json').query().$promise;
    //$scope.vm.dtColumns = $resource('../data/dtColumns.json').query().$promise;
*/


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

    vm.cancel = function(){
        datasetService.clearCriteria();
        $state.go('export.datasets',{studyId:projectId})
    }
    vm.prev = function(){
        //datasetService.clearCriteria();
        $state.go('export.wizard.filters',{studyId:projectId})
    }
    vm.next = function(){
        //datasetService.clearCriteria();
        $state.go('export.wizard.info',{studyId:projectId})
    }

}

angular.module('bioSpeak.export')
    .controller('stepThreeControllerM',['$scope','$state','$stateParams','datasetService', stepThreeControllerM]);