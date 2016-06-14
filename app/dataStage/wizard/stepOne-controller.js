/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepOneController($scope,$state,$stateParams,wizardService){

        var vm = {}
        //$scope.vm = vm;

        $scope.vm = {
            selectedFiles: $stateParams.selFiles,
            selectedDataset:null,
            selectedActivity:null,
            currentFile: $scope.$parent.vm.fileSelected
        };
        console.log($scope.vm)

        console.log('stepOne controller scope',$scope)
        console.log('inside stepOne controller',$stateParams.selFiles)
        //var projectId = $stateParams.projectId
        var projectId = $stateParams.studyId;//"STD-BVS-01";

        wizardService.getActivities(projectId).then(function(activities){
                $scope.activities = activities;
        })


        $scope.goToStep2 = function(){
            $scope.vm.selectedDataset.dataFileDTO = $scope.$parent.vm.fileSelected //fileDTO

            //wizardService.updateDatasetFile($scope.vm.selectedDataset).then(function(){
                $state.go('datastage.wizard.step_two',{
                    activityId: $scope.vm.selectedActivity.id,
                    datasetId: $scope.vm.selectedDataset.id ,
                    fileId: $scope.$parent.vm.fileSelected.dataFileId});
            //})
            //$state.go('datastage.wizard.step_one',{selFiles: $scope.vm.selectedFiles})

        }


    }

    angular.module('bioSpeak.import')
        .controller('stepOneController',['$scope','$state','$stateParams','wizardService',stepOneController]);
