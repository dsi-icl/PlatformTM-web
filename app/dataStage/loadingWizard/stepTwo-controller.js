/**
 * Created by iemam on 06/10/2015.
 */

'use strict';
function stepTwoController($scope,$state,$stateParams,wizardService){

    var vm = this;

    vm.checked = false;
    vm.datasetId = $stateParams.datasetId;
    vm.activityId = $stateParams.activityId;
    vm.fileId = $stateParams.fileId;

    $scope.$parent.wzCtrl.activityId = $stateParams.activityId;
    $scope.$parent.wzCtrl.datasetId = $stateParams.datasetId;


    // wizardService.checkValidTemplate(vm.datasetId,vm.fileId)
    //     .then(function(file){
    //         vm.file = file;
    //         vm.checked = true
    //     });


    $scope.goToActivity = function(){
        $state.go('admin.activity',{ projectId:projectId, activityId: activityId, edit:edit})
    };

}


angular.module('bioSpeak.import')
    .controller('stepTwoController',['$scope','$state','$stateParams','wizardService',stepTwoController])


