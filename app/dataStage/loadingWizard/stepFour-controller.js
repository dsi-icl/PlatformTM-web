/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepFourController($scope,$state,$stateParams,wizardService){

        var vm = {}
        //$scope.vm = vm;

        $scope.vm = {
            datasetId: $stateParams.datasetId,
            activityId:$stateParams.activityId,
            fileId: $stateParams.fileId
        };

        $scope.goToStep3 = function(){
            $state.go('datastage.wizard.step_three',{ activityId: $scope.vm.activityId, datasetId: $scope.vm.datasetId, fileId: $scope.vm.fileId });
        }
        $scope.goToStep5 = function(){
            $state.go('datastage.wizard.step_five',{ activityId: $scope.vm.activityId, datasetId: $scope.vm.datasetId, fileId: $scope.vm.fileId });
        }

    }

    angular.module('bioSpeak.import')
        .controller('stepFourController',['$scope','$state','$stateParams','wizardService',stepFourController]);
