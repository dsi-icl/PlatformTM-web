/**
 * Created by iemam on 06/10/2015.
 */
'use strict';


function previewController($scope, $state, $stateParams, DTOptionsBuilder,exportService){



    var vm = this;
    vm.dataLoaded = false;
    vm.dtColumns = [];
    vm.show = 'tree';
    //$scope.vm = {
    //    dataLoaded : false,
    //    dtColumns :[]
    //}
    var projectId = $stateParams.projectId;
    var datasetId = $stateParams.datasetId;



    //$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    //$scope.vm.dtOptions = DTOptionsBuilder.fromSource(res.data);//res.data//$resource('/angular-datatables/dtOptions.json').get().$promise;
    //$scope.vm.dtColumns = wizardService.getDTheader();

    //$scope.vm.dtColumns = res.header//wizardService.getDataTablePreview($scope.vm.fileName,$scope.vm.map).$promise

    exportService.previewData(projectId,datasetId)
        .then(function(headers){
            console.log(headers)
            vm.dtColumns = headers;
            vm.dataLoaded = true
        })


    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
        return exportService.getDataTableData()
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


    vm.cancel = function(){
        exportService.fetchDataset(datasetId,projectId).then(function(ds) {
            exportService.removeLocalDS(ds);
            $state.go('export.datasets',{projectId:projectId})
        });

    }
    vm.prev = function(){
        $state.go('export.wizard.filters',{
            datasetId: datasetId,
            projectId: projectId
        });
    }
    vm.next = function(){
        $state.go('export.wizard.info',{
            datasetId: datasetId,
            projectId: projectId
        });
    }

}

angular.module('bioSpeak.export')
    .controller('previewController',['$scope','$state','$stateParams','DTOptionsBuilder','exportService', previewController]);