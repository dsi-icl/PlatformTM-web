/**
 * Created by iemam on 02/10/2015.
 */

 'use strict'
    function wizardController($scope, $state, $stateParams,wizardService){

        var vm = {}
        $scope.vm = vm;

        //$scope.vm.selectedFiles = $stateParams.selFiles;

        $scope.vm.projectId = $stateParams.projectId;

        //console.log('inside wizard controller',$stateParams.selFiles, 'service')

        // $scope.selectFile = function(file){
        //     $scope.vm.fileSelected = file;
        // }

        // $scope.getActivities = function(){
        //
        // }

        wizardService.getFile($stateParams.fileId).then(function(file){
            console.log(file)
            $scope.vm.file = file;
        })


        /*fileService.getFiles()
            .then(function(data){
                vm.files = data.files;
                console.log(data)
                $scope.vm = vm;

            })
*/
        /*$scope.openUpload = function(){

            var modalInstance = $modal.open({
                templateUrl: 'fileManager/upload.html',
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
            });
        }*/

        $scope.loadToDB = function(){

        }
    }

    angular.module('bioSpeak.import')
        .controller('wizardController',['$scope','$state','$stateParams','wizardService',wizardController]);