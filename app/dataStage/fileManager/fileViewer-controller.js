
/**
 * Created by iemam on 30/09/2015.
 */

'use strict'
function fileViewController($scope, $state, $stateParams, DTOptionsBuilder, fileService){

    var vm = this;

    vm.projectId= $stateParams.projectId;

    vm.showDT= false;
    vm.dtColumns=[];



    fileService.getDataTablePreview($stateParams.fileId)
        .then(function(result){
            vm.dtColumns = result.tableHeader;
            vm.showDT = true;
            //vm.fileName = result.file.fileName;
            vm.file = result.file;
            vm.folders = result.folders;
            //$scope.$parent.driveVM.fileSelected = fileService.getFileInfo();
            $scope.$parent.driveVM.contentLoaded = true;
            $scope.$parent.driveVM.showControls = true;

        })

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
        return fileService.getDataTableData()
    })
        .withPaginationType('simple')
        .withOption('scrollX', true)


}

angular.module('bioSpeak.DataStager')
    .controller('fileViewController',['$scope', '$state','$stateParams','DTOptionsBuilder','fileService',fileViewController])

