/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepFourController($scope,$state,$stateParams,exportService,toaster){

        var vm = this;
        var projectId = $stateParams.projectId;
        var datasetId = $stateParams.datasetId;

        exportService.fetchDataset(datasetId,projectId).then(function(ds){
            console.log("Back and setting ds to", ds)
            vm.DS = ds;
        })

        vm.availableTags = ['CyTOF','Microarray','Luminex','Samples','FACS','Adverse Events','Chemistry','Cytokines'];
        vm.multipleDemo = {};
        vm.selectedTags = [];

        vm.cancel = function(){
            exportService.removeLocalDS(vm.DS);
            $state.go('export.datasets',{projectId:projectId})
        };

        vm.prev = function(){
            $state.go('export.wizard.preview',{
                datasetId: datasetId,
                projectId: projectId
            });
        };

        vm.finish = function(){
            console.log(vm.DS)
            if(vm.DS.isNew){
                exportService.getMyDatasetResource.save(vm.DS,function(response) {
                //exportService.vm.DS.$save(function(response){
                    console.log("Dataset created");
                    toaster.pop('success', "SUCCESS", vm.DS.name," was successfully SAVED.",2000);
                    $state.go('export.datasets',{projectId:projectId})
                })
                /*exportService.saveUserDataset(vm.DS).then(function(success){
                    if(success){
                        console.log("SAVED DATASET TO DB")
                        $state.go('export.datasets',{projectId:projectId})
                    }

                    else
                        console.log("FAILED TO SAVE DATASET TO DB")
                })*/
            }
            else {
                exportService.getMyDatasetResource.update(vm.DS,function(response) {
                    console.log("Dataset Updated");
                    toaster.pop('success', "SUCCESS", vm.DS.name," was successfully UPDATED.",2000);
                    $state.go('export.datasets',{projectId:projectId})
                    /*$state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });*/
                });
                //exportService.getMyDatasetResource.put(vm.DS);
                /*exportService.updateUserDataset(vm.DS).then(function(success){
                    if(success){
                        console.log("User dataset UPDATED")
                        $state.go('export.datasets',{projectId:projectId})
                    }
                })*/
            }

            exportService.removeLocalDS(vm.DS);
            
        }


    }

    angular.module('bioSpeak.import')
        .controller('stepFourController',['$scope','$state','$stateParams','exportService','toaster',stepFourController]);
