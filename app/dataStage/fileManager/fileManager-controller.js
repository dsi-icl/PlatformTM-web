/**
 * Created by iemam on 30/09/2015.
 */

    'use strict'
    function fileController($scope, $state, $stateParams, $modal, fileService){

        var vm = {}
        $scope.vm = vm;
        $scope.vm.selectedFiles={};
        $scope.vm.selectedFilesCount=0;




        fileService.getFiles($stateParams.studyId)
            .then(function(data){
                vm.files = data.files;
                console.log(data)
                $scope.vm = vm;

            })

        $scope.openUpload = function(){
            $state.go('datastage.upload'/*,{studyId:$stateParams.studyId}*/)

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

        $scope.updateFn = function(fileInfo){
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

        $scope.goToNextStep = function(){
            //TODO: consider storing these files in localstorage
            //console.log($scope)
            //$state.go('datastage.wizard.step_one',{selFiles: $scope.vm.selectedFiles})
            $state.go('datastage.wizard.step_one',{studyId:$stateParams.studyId, selFiles: $scope.vm.selectedFiles})
        }


    }

    angular.module('bioSpeak.DataStager')
        .controller('fileController',['$scope', '$state','$stateParams','$modal','fileService',fileController])

