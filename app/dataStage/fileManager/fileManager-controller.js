/**
 * Created by iemam on 30/09/2015.
 */

'use strict'
function fileController($scope, $state, $stateParams, SweetAlert, fileService){

    //var vm = {}
    //$scope.vm = vm;
    //$scope.vm.selectedFiles={};
    //$scope.vm.selectedFilesCount=0;
    //
    //$scope.vm.dir = $stateParams.dir
    //$scope.vm.projectId = $stateParams.studyId

    var vm = this;

    vm.projectId = $stateParams.projectId;
    vm.dir = $stateParams.dir;
    vm.selectedFiles={};
    vm.selectedFilesCount=0;
    vm.showSideMenu = false;
    vm.showControls = false;
    vm.fileSelected = {};
    vm.currentFile = '';


    fileService.getDirectories(vm.projectId)
        .then(function(data){
            vm.dirs = data.files;
            //console.log(data.files);
            //$scope.vm.dirs = data.files;

            fileService.getContent(vm.projectId,$stateParams.dir)
                .then(function(data){
                    vm.files = data.files;
                })
        })



    vm.createDirectory = function(){
        console.log(vm.newdir)
        if(vm.newdir)
            fileService.createDirectory(vm.projectId,$scope.vm.newdir)
                .then(function(data){
                    //$scope.vm.dirs = data;

                    fileService.getDirectories(vm.projectId)
                        .then(function(data){
                            vm.dirs = data.files;})

                    $state.go('datastage.files',{dir:$scope.vm.newdir});
                })
    }

    vm.openUpload = function(){
        console.log($stateParams)
        $state.go('datastage.upload',{dir:$stateParams.dir})

        /*var modalInstance = $modal.open({
         templateUrl: 'dataStage/upload/upload.html',
         controller: 'uploadController'
         });

         modalInstance.result.then(function () {
         fileService.getFiles()
         .then(function(data){
         vm.files = data.files;
         console.log(data)
         $scope.vm = vm;

         })
         }, function () {
         console.info('Modal dismissed at: ' + new Date());
         });*/
    }

    vm.updateFn = function(fileInfo){
        if(fileInfo.selected){
            $scope.vm.selectedFiles[fileInfo.fileName] = fileInfo//.dataFileId
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

    vm.clickFn = function(event){
        console.log("div clicked")


        var path;

        if(event.target.classList.contains('outer'))
        {
            vm.showControls = false;
            angular.element(document.querySelectorAll('.file > a.active')).removeClass('active')
        }
        // angular.forEach(vm.files,function(file){
        //     file.selected=false;
        // })
        //vm.fileSelected = null;
        //angular.forEach(vm.files){

        //}
        //     vm.fileSelected = fileInfo;
        //     fileInfo.selected = !fileInfo.selected
        //     console.log(vm.fileSelected)
        //}
        // else
        //     vm.showControls = false;

    }

    vm.deleteFile = function(){
        console.log("fileManager-controller: information about the relevant selected file ", vm.fileSelected);
        var fileId = vm.fileSelected.dataFileId;
        console.log("FileId to be deleted is ", fileId);

        SweetAlert.swal({
                title: "Are you sure you want to delete "+vm.fileSelected.fileName+" ?",
                text: "All previously loaded content will be unloaded from the database and the file will be permanently deleted! ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {
                    fileService.deleteFile(fileId)
                        .then(function(data){
                            SweetAlert.swal("Deleted!", "File "+vm.fileSelected.fileName+" has been deleted.", "success");
                            $state.go('datastage.files',{dir:vm.dir});
                        })
                } else {
                    SweetAlert.swal("Cancelled", "", "error");
                }
            });


    }

    vm.fileClickFn = function(fileInfo){
        console.log("fileClicked")
        angular.element(document.querySelectorAll('.file > a.active')).removeClass('active')
        angular.forEach(vm.files,function(file){
            file.selected=false;
        })
        if(fileInfo && !fileInfo.selected){
            vm.showControls = true;
            vm.fileSelected = fileInfo;
            fileInfo.selected = !fileInfo.selected
            console.log(vm.fileSelected)
        }
    }

    vm.openF = function(fileInfo){
        if(!fileInfo){
            fileInfo =   vm.fileSelected
        }
        console.log(fileInfo,"double clicked")



        var path;
        if(fileInfo.isDirectory){

            if(fileInfo.path.indexOf('\\')!=-1){
                var pathStart = fileInfo.path.indexOf('\\');
                //console.log(pathStart)
                var path2 = fileInfo.path.substring(pathStart+1,fileInfo.path.size)

                path = path2+"/"+fileInfo.fileName;
            }
            else
                path = fileInfo.fileName;
            //console.log(path);

            $state.go('datastage.files',{dir:path})

        }else{
            //console.log(fileInfo)
            //vm.currentFile = fileInfo
            $state.go('datastage.files.view',{fileId:fileInfo.dataFileId})
        }
    };

    vm.downloadFile = function(){
        if(vm.fileSelected){
            fileService.downloadFile(vm.fileSelected.dataFileId)
        }
    }

    vm.load = function(){
       console.log(vm.fileSelected)
        if(vm.fileSelected)
        //console.log($scope)
        //$state.go('datastage.wizard.step_one',{selFiles: $scope.vm.selectedFiles})
        $state.go('datastage.wizard.step_one',{projectId:vm.projectId, fileId:vm.fileSelected.dataFileId})
    };

    vm.unload = function(){
        //console.log(vm.fileSelected)
        if(vm.fileSelected){
            SweetAlert.swal({
                    title: "Are you sure you want to unload "+vm.fileSelected.fileName+" ?",
                    text: "All previously loaded content will be unloaded from the database! ",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, unload it!",
                    cancelButtonText: "No, cancel plz!",
                    closeOnConfirm: false,
                    closeOnCancel: false },
                function (isConfirm) {
                    if (isConfirm) {
                        fileService.unloadFile(vm.fileSelected.dataFileId)
                            .then(function (data) {
                                SweetAlert.swal("Unloaded!", "File " + vm.fileSelected.fileName + " has been unloaded from the database.", "success");
                                $state.go('datastage.files', {dir: vm.dir});
                            })
                    } else {
                        SweetAlert.swal("Cancelled", "", "error");
                    }
                }
            )
        }
    }

    vm.computeFields = function(){
        if(vm.fileSelected)
            fileService.computeFields(vm.fileSelected.dataFileId).then(function(){

        })
    }

    vm.showInfo = function(){
        console.log('toggling')
        // $mdSidenav('right').toggle();
        vm.showSideMenu = !vm.showSideMenu;
        console.log(vm.fileSelected)
    }



}

angular.module('bioSpeak.DataStager')
    .controller('fileController',['$scope', '$state','$stateParams','SweetAlert','fileService',fileController])

