
/**
 * Created by iemam on 30/09/2015.
 */

'use strict'
function fileViewController($scope, $state, $stateParams, DTOptionsBuilder, fileService){



    $scope.vm = {
        //datasetId: $stateParams.datasetId,
        //activityId:$stateParams.activityId,
        fileId: $stateParams.fileId,
        //map: $stateParams.map,
        showDT: false,
        dtColumns:[]
    }


    fileService.getDataTablePreview($scope.vm.fileId)
        .then(function(headers){
            //console.log(headers)
            $scope.vm.dtColumns = headers;
            $scope.vm.showDT = true
            $scope.vm.fileName = fileService.getFileInfo();

            $scope.$parent.vm.currentFile = fileService.getFileInfo();
        })

    $scope.vm.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
        return fileService.getDataTableData()
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


    //fileService.getDirectories($stateParams.studyId)
    //    .then(function(data){
    //        vm.dirs = data.files;
    //        // console.log(data.files);
    //        $scope.vm.dirs = data.files;
    //
    //        fileService.getContent($stateParams.studyId,$stateParams.dir)
    //            .then(function(data){
    //                vm.files = data.files;
    //                //console.log(data)
    //                $scope.vm = vm;
    //
    //            })
    //
    //
    //    }).then(
    //
    //)



    //$scope.createDirectory = function(){
    //    console.log($scope.vm.newdir)
    //    fileService.createDirectory($stateParams.studyId,$scope.vm.newdir)
    //        .then(function(data){
    //            $scope.vm.dirs = data;
    //            $state.go('datastage.files',{dir:$scope.vm.newdir});
    //        })
    //}




    $scope.goToNextStep = function(){
        //TODO: consider storing these files in localstorage
        //console.log($scope)
        //$state.go('datastage.wizard.step_one',{selFiles: $scope.vm.selectedFiles})
        $state.go('datastage.wizard.step_one',{studyId:$stateParams.studyId, selFiles: $scope.vm.selectedFiles})
    }


}

angular.module('bioSpeak.DataStager')
    .controller('fileViewController',['$scope', '$state','$stateParams','DTOptionsBuilder','fileService',fileViewController])

