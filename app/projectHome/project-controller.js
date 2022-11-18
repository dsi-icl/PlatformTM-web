'use strict';
function ProjectHomeCtrl($scope,$state,$stateParams,projService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.ready = false;


    if($stateParams.projectId !== 'new') {
        projService.getProjectResource.getProjectById({projectId: $stateParams.projectId},
            function (response) {
                vm.project = response;
                //vm.project.isNew = false;
                //vm.project = project
                //vm.ready = true
            });

        projService.getProjectResource.getClinicalDatasets({projectId:vm.projectId},function(response){
            vm.clinicalDatasets = response;
        });
    }
}

angular.module('bioSpeak.projectHome')
    .controller('ProjectHomeCtrl',['$scope','$state','$stateParams','projService',ProjectHomeCtrl]);