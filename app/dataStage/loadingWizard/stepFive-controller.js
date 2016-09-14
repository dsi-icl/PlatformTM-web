/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepFiveController($scope,$state,$stateParams,wizardService){

        var vm = {}
        //$scope.vm = vm;

        $scope.vm = {
            datasetId: $stateParams.datasetId,
            activityId:$stateParams.activityId,
            fileId: $stateParams.fileId,
            studyId: $stateParams.studyId

        };

        $scope.loadedDataset = false;
        $scope.loadedObs = false;
        $scope.obsExtracted = false;

        //var projectId = "STD-BVS-01";
        var datasetId = $stateParams.datasetId;
        var fileId = $stateParams.fileId;
        console.log(datasetId);
        //var filename = "ProjectIdVitalSigns";

        $scope.goToStep4 = function(){
            $state.go('datastage.wizard.step_four',{ activityId: $scope.vm.activityId, datasetId: $scope.vm.datasetId, fileId: fileId });
        }
        $scope.finish = function(){
            $state.go('datastage.files',{studyId:$stateParams.studyId, dir:$stateParams.dir})
        }

        wizardService.loadDataset(datasetId, fileId).then(function(success){
            console.log(success)

            if(success){
                $scope.loadedDataset = true;
                return wizardService.extractObs(datasetId,fileId)
            }
            else
                $scope.loadingFailed = true;
        }).then(function(success){
            console.log('BACK from mysql')
            if(success)
                $scope.obsExtracted = true;
        })

        //$scope.activities = [{'name':'ibrahim'},{'name':'assem'},{'name':'emam'},{'name':'nelly'}]


    }

    angular.module('bioSpeak.import')
        .controller('stepFiveController',['$scope','$state','$stateParams','wizardService',stepFiveController]);
