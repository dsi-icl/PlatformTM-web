/**
 * Created by iemam on 02/10/2015.
 */

'use strict'
function wizardController($scope, $state, $stateParams,wizardService){

    var vm = this;

    vm.projectId = $stateParams.projectId;



    //vm.datasetId= $stateParams.datasetId;
    //vm.activityId= $stateParams.activityId;
    //vm.projectId= $stateParams.projectId;
    vm.fileId= $stateParams.fileId;

    wizardService.getFile($stateParams.fileId).then(function(file){
        vm.file = file;
        $scope.$parent.vm.folderId = file.folderId;
    });

    vm.goToStep5 = function(activityId,datasetId){
        vm.datasetId= datasetId;
        vm.activityId= activityId;
        $state.go('loader.wizard.step_five',{
            activityId: activityId,
            datasetId: datasetId,
            fileId: vm.fileId });
    }

    vm.goToStep4 = function(activityId,datasetId){
        vm.datasetId= datasetId;
        vm.activityId= activityId;
        $state.go('loader.wizard.step_four',{
            activityId: activityId,
            datasetId: datasetId,
            fileId: vm.fileId });
    };

    vm.goToStep3 = function(activityId,datasetId){
        vm.datasetId= datasetId;
        vm.activityId= activityId;
        $state.go('loader.wizard.step_three',{
            activityId: activityId,
            datasetId: datasetId,
            fileId: vm.fileId });

    };

    vm.goToStep2 = function(assessmentId,datasetId){
        vm.datasetId= datasetId;
        vm.assessmentId= assessmentId;
        $state.go('loader.wizard.step_two',{
            assessmentId: assessmentId,
            datasetId: datasetId ,
            fileId: vm.fileId});

    };

    vm.goToStep1 = function () {
        $state.go('loader.wizard.step_one',{
            fileId: vm.fileId});
    }

    vm.cancel = vm.finish =  function () {
        $state.go('project.drive.files',{
            projectId: vm.projectId, dirId:vm.file.folderId});
    }


}

angular.module('bioSpeak.import')
    .controller('wizardController',['$scope','$state','$stateParams','wizardService',wizardController]);