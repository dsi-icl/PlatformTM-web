/**
 * Created by iemam on 30/09/2015.
 */

'use strict'
function driveController($scope, $state, $stateParams, SweetAlert, $uibModal, fileService){


    var vm = this;

    vm.projectId = $stateParams.projectId;
    vm.dirId = $stateParams.dirId;
    vm.showSideMenu = false;
    vm.showControls = false;
    vm.fileSelected = {};
    vm.currentFolderId = 0;
    vm.contentLoaded = false;


    fileService.getDirectories(vm.projectId)
        .then(function(data){
            vm.dirs = data.files;
        });

    vm.createFolder = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'dataStage/fileManager/newFolderForm.html',
            controller: function ($uibModalInstance) {
                var folderModalCtrl = this;
                folderModalCtrl.ok = function () {
                    var folder = {};
                    folder.name = folderModalCtrl.name;
                    folder.parentFolderId = $stateParams.dirId;
                    console.log(folder)
                    fileService.createDirectory(vm.projectId,folder).then(function () {
                        $state.reload("project.drive.files");
                    })
                    $uibModalInstance.close();
                };

                folderModalCtrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            controllerAs: 'folderModalCtrl'
        });
    }

    vm.openUpload = function(){
        $state.go('project.drive.upload',{dirId:vm.dirId})
    };

    vm.deleteFile = function(){
        var fileId = vm.fileSelected.dataFileId;
        SweetAlert.swal({
                title: "Are you sure you want to delete "+vm.fileSelected.fileName+" ?",
                text: "All previously loaded content will be unloaded from the database and the file will be permanently deleted! ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plz!",
                closeOnConfirm: false,
                closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {
                    fileService.deleteFile(fileId)
                        .then(function(data){
                            SweetAlert.swal("Deleted!", "File "+vm.fileSelected.fileName+" has been deleted.", "success");
                            $state.go('project.drive.files',{},{
                                reload: true,
                                inherit: true,
                                notify: true
                            });
                        })
                } else {
                    SweetAlert.swal("Cancelled", "", "error");
                }
            });


    }

    vm.fileClickFn = function(fileInfo){
        //console.log(fileInfo)
        fileInfo.selected = true;
        angular.element(document.querySelectorAll('.file > a.active')).toggleClass('active')
        angular.forEach(vm.files,function(file){
            if(file.dataFileId !== fileInfo.dataFileId)
                file.selected=false;
        })

        if(fileInfo && fileInfo.selected){
            vm.showControls = true;
            vm.fileSelected = fileInfo;
        }
    }

    vm.clickFn = function(event){
        if(event.target.classList.contains('outer'))
        {
            vm.showControls = false;
            angular.element(document.querySelectorAll('.file > a.active')).toggleClass('active')
        }
    }

    vm.openF = function(fileInfo){
        if(!fileInfo){
            fileInfo =   vm.fileSelected
        }
        vm.showControls = false;
        if(fileInfo.isDirectory){
            vm.currentFolderId = fileInfo.dataFileId;
            $state.go('project.drive.files',{dirId:fileInfo.dataFileId})

        }else{
            $state.go('project.drive.view',{fileId:fileInfo.dataFileId})
        }
    };

    vm.downloadFile = function(file){
        if(!file){
            file =   vm.fileSelected
        }
        if(file)
            fileService.downloadFile(file.dataFileId)
    }

    vm.load = function(file){
        if(!file){
            file =   vm.fileSelected
        }
        if(file)
            $state.go('loader.wizard.step_one',{projectId:vm.projectId, fileId:file.dataFileId})
    };

    vm.unload = function(file){
        if(!file){
            file =   vm.fileSelected
        }

        if(file){
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

    vm.showInfo = function(){
        console.log('toggling')
        vm.showSideMenu = !vm.showSideMenu;
        console.log(vm.fileSelected)
    }

}

angular.module('bioSpeak.DataStager')
    .controller('driveController',['$scope', '$state','$stateParams','SweetAlert','$uibModal','fileService',driveController])

