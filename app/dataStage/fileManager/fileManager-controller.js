/**
 * Created by iemam on 30/09/2015.
 */

    'use strict'
    function fileController($scope, $state, $stateParams, $modal, fileService){

        //var vm = {}
        //$scope.vm = vm;
        //$scope.vm.selectedFiles={};
        //$scope.vm.selectedFilesCount=0;
        //
        //$scope.vm.dir = $stateParams.dir
        //$scope.vm.projectId = $stateParams.studyId

        var vm = this;

        vm.projectId = $stateParams.studyId;
        vm.dir = $stateParams.dir;
        vm.selectedFiles={};
        vm.selectedFilesCount=0;


        fileService.getDirectories($stateParams.studyId)
            .then(function(data){
                vm.dirs = data.files;
                //console.log(data.files);
                //$scope.vm.dirs = data.files;

                fileService.getContent($stateParams.studyId,$stateParams.dir)
                    .then(function(data){
                        vm.files = data.files;
                    })
            })



        vm.createDirectory = function(){
            console.log(vm.newdir)
            if(vm.newdir)
                fileService.createDirectory($stateParams.studyId,$scope.vm.newdir)
                    .then(function(data){
                        //$scope.vm.dirs = data;

                        fileService.getDirectories($stateParams.studyId)
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

        vm.clickFn = function(fileInfo){
            //console.log(fileInfo)
            var path;
            if(fileInfo.isDirectory){

                if(fileInfo.path.indexOf('\\')!=-1){
                    var pathStart = fileInfo.path.indexOf('\\');
                    console.log(pathStart)
                    var path2 = fileInfo.path.substring(pathStart+1,fileInfo.path.size)

                    path = path2+"/"+fileInfo.fileName;
                }
                else
                    path = fileInfo.fileName;
                console.log(path);

                $state.go('datastage.files',{dir:path})

            }else{
                console.log(fileInfo)
                $state.go('datastage.files.view',{fileId:fileInfo.dataFileId})
            }
        }

        vm.goToNextStep = function(){
            //TODO: consider storing these files in localstorage
            //console.log($scope)
            //$state.go('datastage.wizard.step_one',{selFiles: $scope.vm.selectedFiles})
            $state.go('datastage.wizard.step_one',{studyId:$stateParams.studyId, selFiles: $scope.vm.selectedFiles})
        }


    }

    angular.module('bioSpeak.DataStager')
        .controller('fileController',['$scope', '$state','$stateParams','$modal','fileService',fileController])

