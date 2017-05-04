/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepFiveController($scope,$state,$stateParams,$interval,wizardService){

        var vm = this;

        vm.datasetId= $stateParams.datasetId;
        vm.activityId= $stateParams.activityId;
        vm.fileId= $stateParams.fileId;
        vm.projectId= $stateParams.projectId;
        vm.loadedDataset = false;
        vm.loadedObs = false;
        vm.obsExtracted = false;
        vm.loadingFailed = false;
        vm.isLoading = false;
        vm.isFinished = false;
        vm.progress =0;

        var datasetId = $stateParams.datasetId;
        var fileId = $stateParams.fileId;


        vm.goToStep4 = function(){
            $state.go('datastage.wizard.step_four',{ activityId: vm.activityId, datasetId: vm.datasetId, fileId: fileId });
        };
        vm.finish = function(){
            $state.go('datastage.files',{projectId:$stateParams.projectId, dir:$stateParams.dir})
        };

        var progress;
        vm.loadFile2 = function(){
            vm.isLoading = true;
            wizardService.loadDataset(datasetId, fileId);
            progress = $interval(function() {
                wizardService.getLoadingProgress(fileId).then(function(fileInfo){
                    //console.log('inside controller ' ,fileInfo)
                    vm.progress = fileInfo.percentLoaded;
                    if(fileInfo.state === 'LOADED' ||  fileInfo.state === 'SAVED'){

                        // vm.loadedDataset = true;

                        _fileIsLoaded(fileInfo)
                        //return wizardService.extractObs(datasetId,fileId)
                    }

                })
            }, 500);

        };

        var _fileIsLoaded = function(fileInfo){
            $interval.cancel(progress);
            if(fileInfo.state === 'LOADED'){
                console.log(fileInfo.state);
                vm.isLoading = false;
                vm.loadedDataset = true;
                vm.isFinished = true;
                vm.obsExtracted = true;
            }else if(fileInfo.state === 'FAILED'){
                vm.isLoading=false;
                vm.loadingFailed = true;
                vm.isFinished = true;
            } else if(fileInfo.state === 'SAVED'){
                vm.loadedDataset = true;
                wizardService.extractObs(datasetId,fileId).then(function(success){
                    if(success)
                        vm.obsExtracted = true;
                    else
                        vm.loadingFailed = true;
                    vm.isLoading = false;
                    vm.isFinished = true;
                })
            }
        };

        $scope.$on('$destroy', function() {
            // Make sure that the interval is destroyed too
            $interval.cancel(progress);
        });

        vm.loadFile = function(){
            vm.isLoading = true;
            wizardService.loadDataset(datasetId, fileId).then(function(success){
                if(success){
                    vm.loadedDataset = true;
                    return wizardService.extractObs(datasetId,fileId)
                }
                else{
                    vm.isLoading=false;
                    vm.loadingFailed = true;
                    vm.isFinished = true;
                }
            }).then(function(success){
                console.log('BACK from mysql')
                if(success)
                    vm.obsExtracted = true;
                else
                    vm.loadingFailed = true;
                vm.isLoading = false;
                vm.isFinished = true;
            });
        }

        vm.getProgress=  function(fileId){
            var Sec = 2000;

            var getProgress = $interval(function() {
                wizardService.getLoadingProgress(fileId).then(function(progress){
                    vm.progress = progress;
                    if(progress === 100){
                        $interval.cancel(getProgress);
                        vm.loadedDataset = true;
                    }

                })
            }, 2000);

        };

    }

    angular.module('bioSpeak.import')
        .controller('stepFiveController',['$scope','$state','$stateParams','$interval','wizardService',stepFiveController]);
