'use strict'
function projectController($scope, $state, $stateParams,ProjectService,toaster) {
    var vm = this;
    
    vm.project = {}


    var project;
    vm.projectId = $stateParams.projectId
    if($stateParams.projectId=='new'){
        console.log("New Project");
        project = new ProjectService.getProjectResource();
        project.isNew = true;
        project.status = "New";
        project.studies = [];
        vm.project = project;

        toaster.pop('info', "Create a project first by editing Project Name", " ",8000);

    }
    else if($stateParams.projectId){
        ProjectService.getProjectResource.getProjectByAccession({ projectId: $stateParams.projectId }, function(response){
            project = response;
            project.isNew = false;

            vm.project = project

            console.log(vm.project);

        });
    }





    //Retrieves list of study activities
    ProjectService.getProjectResource.getActivitiesForProject({projectId:vm.projectId},function(response){
        vm.activities = response;
    });

    vm.openUpload = function() {
        console.log($stateParams)
        $state.go('datastage.upload', {dir: $stateParams.dir})
    }

    vm.goToActivity = function(activity,edit){
        if(activity.isAssay)
            $state.go('admin.assay',{ projectId:vm.projectId, assayId: activity.id, edit:edit})
        else
            $state.go('admin.activity',{ projectId:vm.projectId, activityId: activity.id, edit:edit})
    }

    vm.removeActivity = function(activity){
        ActivityResource.delete();
    }

    vm.saveProject = function(){
        if(vm.project.isNew){
            if(vm.project.name && vm.project.title){
                vm.project.$save(function(response) {
                    console.log("Project created",response);
                    toaster.pop('success', "SUCCESS", vm.project.name," was successfully CREATED.",8000);
                    $stateParams.projectId = response.id;
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            }
            else{
                //toaster.pop('error',"", "Please enter the project 'Name' and 'Title' before creating the project.",8000);
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: "Please enter the project 'Name' and 'Title' before creating the project.",
                    showCloseButton: true
                });
            }


        }
        else{
            console.log("Project Edited");

            vm.project.$update(function(response) {
                console.log("Project Updated");
                toaster.pop('success', "SUCCESS", vm.project.name," was successfully UPDATED.",8000);
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            });
        }
    };

    vm.dontSaveProject = function(){
        vm.project = {}
        project = null
        $state.go('admin.projects');
    }
    
}
angular.module('bioSpeak.config')
    .controller('ProjectCtrl',['$scope', '$state','$stateParams','ProjectService','toaster',projectController])