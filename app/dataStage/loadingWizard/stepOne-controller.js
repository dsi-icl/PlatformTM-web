/**
 * Created by iemam on 06/10/2015.
 */
    'use strict';
    function stepOneController($scope,$state,$stateParams,wizardService){

        var vm = {}

        var vm = this;
        vm.selectedDataset = null;
        vm.selectedActivity = null;
        vm.fileId = $stateParams.fileId;

        var projectId = $stateParams.projectId;

        wizardService.getActivities(projectId).then(function(activities){
                vm.activities = activities;
        })


        // $scope.goToStep2 = function(){
        //     //$scope.vm.selectedDataset.dataFileDTO = $scope.$parent.vm.fileSelected //fileDTO
        //
        //     $scope.$parent.vm.activityId = vm.selectedActivity.id;
        //     $scope.$parent.vm.datasetId = vm.selectedDataset.id;
        //         $state.go('project.wizard.step_two',{
        //             activityId: vm.selectedActivity.id,
        //             datasetId: vm.selectedDataset.id ,
        //             fileId: vm.fileId});
        // }


    }

    angular.module('bioSpeak.import')
        .controller('stepOneController',['$scope','$state','$stateParams','wizardService',stepOneController]);
