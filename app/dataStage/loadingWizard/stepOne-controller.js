/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepOneController($scope,$state,$stateParams,wizardService){

        var vm = {}
        //$scope.vm = vm;

        $scope.vm = {
            //selectedFiles: $stateParams.selFiles,
            selectedDataset:null,
            selectedActivity:null,
            fileId: $stateParams.fileId
        };
        
        

        var projectId = $stateParams.studyId;

        wizardService.getActivities(projectId).then(function(activities){
                $scope.activities = activities;
        })


        $scope.goToStep2 = function(){
            //$scope.vm.selectedDataset.dataFileDTO = $scope.$parent.vm.fileSelected //fileDTO
            
            $scope.$parent.vm.activityId = $scope.vm.selectedActivity.id;
            $scope.$parent.vm.datasetId = $scope.vm.selectedDataset.id;
                $state.go('datastage.wizard.step_two',{
                    activityId: $scope.vm.selectedActivity.id,
                    datasetId: $scope.vm.selectedDataset.id ,
                    fileId: $scope.vm.fileId});
        }


    }

    angular.module('bioSpeak.import')
        .controller('stepOneController',['$scope','$state','$stateParams','wizardService',stepOneController]);
