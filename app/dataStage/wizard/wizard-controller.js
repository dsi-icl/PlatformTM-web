/**
 * Created by iemam on 02/10/2015.
 */

 'use strict'
    function wizardController($scope, $state, $stateParams){

        var vm = {}
        $scope.vm = vm;

        $scope.vm.selectedFiles = $stateParams.selFiles;

        console.log('inside wizard controller',$stateParams.selFiles, 'service')

        $scope.selectFile = function(file){
            $scope.vm.fileSelected = file.fileName;

        }

        $scope.getActivities = function(){

        }

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
        .controller('wizardController',['$scope','$state','$stateParams',wizardController]);