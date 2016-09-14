/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepFourController($scope,$state,$stateParams,exportService,toaster){

        var vm = this;
        var projectId = $stateParams.studyId
        
        vm.DS = $scope.$parent.parentCtrl.DS;

        vm.availableTags = ['CyTOF','Microarray','Luminex','Samples','FACS','Adverse Events','Chemistry','Cytokines'];
        vm.multipleDemo = {};
        vm.selectedTags = [];

        vm.cancel = function(){
            datasetService.clearCriteria();
            $state.go('export.datasets',{studyId:projectId})
        }
        vm.prev = function(){
            //datasetService.clearCriteria();
            $state.go('export.wizard.preview.table',{studyId:projectId})
        }
        vm.finish = function(){
            console.log(vm.DS)
            if(vm.DS.isNew){
                vm.DS.$save(function(response){
                    console.log("Dataset created");
                    toaster.pop('success', "SUCCESS", vm.DS.name," was successfully SAVED.",4000);
                    $state.go('export.datasets',{studyId:projectId})
                })
                /*exportService.saveUserDataset(vm.DS).then(function(success){
                    if(success){
                        console.log("SAVED DATASET TO DB")
                        $state.go('export.datasets',{studyId:projectId})
                    }

                    else
                        console.log("FAILED TO SAVE DATASET TO DB")
                })*/
            }
            else {
                vm.DS.$update(function(response) {
                    console.log("Dataset Updated");
                    toaster.pop('success', "SUCCESS", vm.DS.name," was successfully UPDATED.",4000);
                    $state.go('export.datasets',{studyId:projectId})
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
                        $state.go('export.datasets',{studyId:projectId})
                    }
                })*/
            }
                
            
        }


    }

    angular.module('bioSpeak.import')
        .controller('stepFourController',['$scope','$state','$stateParams','exportService','toaster',stepFourController]);
