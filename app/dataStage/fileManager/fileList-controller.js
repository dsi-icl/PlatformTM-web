/**
 * Created by iemam on 16/02/2016.
 */
/**
 * Created by iemam on 15/02/2016.
 */
/**
 * Created by iemam on 30/09/2015.
 */

'use strict'
function fileListController($scope, $state, $stateParams, $timeout,fileService){

    //var vm = {}
    //$scope.vm = vm;
    //$scope.vm.selectedFiles={};
    //$scope.vm.selectedFilesCount=0;

    //$scope.vm.dir = $stateParams.dir
    //$scope.vm.projectId = $stateParams.studyId
    //$scope.vm.showDT = false;
    //$scope.vm.dtColumns= [];

    //$scope.vm = {
    //    //datasetId: $stateParams.datasetId,
    //    //activityId:$stateParams.activityId,
    //    fileId: $stateParams.fileId,
    //
    //}
    var fileListCtrl = this

    //console.log($scope.vm)

    $timeout(function() {
        console.log("Getting dir contents")
        fileService.getContent($stateParams.studyId,$stateParams.dir)
            .then(function(data){
                fileListCtrl.files = data.files;
                //console.log(data)
                //$scope.vm = vm;

            })
    },2000)




    fileListCtrl.updateFn = function(fileInfo){
        if(fileInfo.selected){
            $scope.vm.selectedFiles[fileInfo.fileName] = fileInfo
            $scope.vm.selectedFilesCount++
        }
        else{
            /*index = selectedFiles.indexOf(fileInfo.fileName);
             $scope.bdays.splice(index, 1);
             */
            delete $scope.vm.selectedFiles[fileInfo.fileName]
            $scope.vm.selectedFilesCount--
        }

        console.log($scope.vm.selectedFilesCount,$scope.vm.selectedFiles)
    }

    fileListCtrl.clickFn = function(fileInfo){
        console.log(fileInfo)
        if(fileInfo.isDirectory){
            $state.go('datastage.files.list',{dir:fileInfo.fileName})
        }else{
            console.log(fileInfo)
            $state.go('datastage.files.view',{fileId:fileInfo.dataFileId})
        }
    }
}

angular.module('bioSpeak.DataStager')
    .controller('fileListController',['$scope', '$state','$stateParams','$timeout','fileService',fileListController])

