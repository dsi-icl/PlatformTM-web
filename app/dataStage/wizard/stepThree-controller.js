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
        map: $stateParams.map,
        showDT: false,
        dtColumns:[]
    }



    //$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    //$scope.vm.dtOptions = DTOptionsBuilder.fromSource(res.data);//res.data//$resource('/angular-datatables/dtOptions.json').get().$promise;
    //$scope.vm.dtColumns = wizardService.getDTheader();

    //$scope.vm.dtColumns = res.header//wizardService.getDataTablePreview($scope.vm.fileName,$scope.vm.map).$promise

    //TODO: change that to only send datasetId as parameter ... in the backend
    //TODO: ...iin the backend the preview is of the datafile that was either the result of the mapping
    //TODO: or the same datafile which was detected to match the template
    wizardService.getDataTablePreview($scope.vm.datasetId, $scope.vm.standardFileId)
        .then(function(headers){
            //console.log(headers)
            $scope.vm.dtColumns = headers;
            $scope.vm.showDT = true
        })

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

    /**
     * persons - Data used in Tables view for Data Tables plugin
     */
   /* $scope.persons = [
        {
            id: '1',
            firstName: 'Monica',
            lastName: 'Smith'
        },
        {
            id: '2',
            firstName: 'Sandra',
            lastName: 'Jackson'
        },
        {
            id: '3',
            firstName: 'John',
            lastName: 'Underwood'
        },
        {
            id: '4',
            firstName: 'Chris',
            lastName: 'Johnatan'
        },
        {
            id: '5',
            firstName: 'Kim',
            lastName: 'Rosowski'
        }
    ];*/
}

angular.module('bioSpeak.import')
    .controller('stepThreeController',['$scope','$state','$stateParams','DTOptionsBuilder','$resource','wizardService', stepThreeController]);