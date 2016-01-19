/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepFiveController($scope,$state,$stateParams,wizardService){

        var vm = {}
        //$scope.vm = vm;

        $scope.vm = {
            selectedFiles: $stateParams.selFiles,
            selectedDataset:null,
            selectedActivity:null,
            datasetId: $stateParams.datasetId,
            activityId:$stateParams.activityId,
            standardFileId: $stateParams.standardFileId

        };

        $scope.loadedDataset = false;
        $scope.loadedObs = false;
        $scope.obsExtracted = false;

        //var projectId = "STD-BVS-01";
        var datasetId = $stateParams.datasetId;
        console.log(datasetId);
        //var filename = "ProjectIdVitalSigns";

        wizardService.loadDataset(datasetId, standardFileId).then(function(success){
            if(success){
                $scope.loadedDataset = true;
                return wizardService.extractObs(datasetId)
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
