'use strict'
function projectListController($scope, $state, $stateParams,ProjectService,toaster) {
    var vm = this;
    
    vm.projects = {}








    //Retrieves list of study activities
    ProjectService.getProjectResource.get(function(response){
        vm.projects = response;
    });



    vm.goToActivity = function(activity,edit){
        if(activity.isAssay)
            $state.go('admin.assay',{ projectId:vm.projectId, assayId: activity.id, edit:edit})
        else
            $state.go('admin.activity',{ projectId:vm.projectId, activityId: activity.id, edit:edit})
    }




    
}
angular.module('bioSpeak.config')
    .controller('ProjectsCtrl',['$scope', '$state','$stateParams','ProjectService','toaster',projectListController])