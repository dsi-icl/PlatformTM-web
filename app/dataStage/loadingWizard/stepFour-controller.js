/**
 * Created by iemam on 06/10/2015.
 */
    'use strict';
    function stepFourController($scope,$state,$stateParams,wizardService){

        var vm = this;
        vm.params = {
            datasetId: $stateParams.datasetId,
            activityId:$stateParams.activityId,
            fileId: $stateParams.fileId
        };
        $scope.$parent.wzCtrl.activityId = $stateParams.activityId;
        $scope.$parent.wzCtrl.datasetId = $stateParams.datasetId;
    }

    angular.module('bioSpeak.import')
        .controller('stepFourController',['$scope','$state','$stateParams','wizardService',stepFourController]);
