'use strict'
function projectController($scope, $state, $stateParams,ProjectService,toaster) {
    var vm = this;
    
    vm.project = {}


    var project;
    if($stateParams.projectId=='new'){
        console.log("New Project");
        project = new ProjectService.getProjectResource();
       // project.ProjectAcc = $stateParams.studyId;//"Study1"
        project.isNew = true;
        project.status = "New";
        project.studies = [];
        vm.project = project;

    }
    else if($stateParams.projectId){
        ProjectService.getProjectResource.getProjectByAccession({ projectId: $stateParams.projectId }, function(response){
            project = response;
            project.isNew = false;

            vm.project = project

            console.log(vm.project);

        });
    }


    /*vm.project.isNew = false

    vm.project.name = "BioVacSafe"
    vm.project.title = "Biomarkers for enhanced vaccines immunosafety"
    vm.project.accession = "P-BVS";

    vm.studyId = $stateParams.studyId*/
    
    vm.projectId = $stateParams.projectId

    /*console.log("List Controller requested")
    console.log($stateParams);*/

    vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    vm.project.state = "Alabama"
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
            vm.project.$save(function(response) {
                console.log("Project created",response);
                toaster.pop('success', "SUCCESS", vm.project.name," was successfully CREATED.",8000);
                $stateParams.projectId = response.accession;
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            });
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

    vm.dontSaveActivity = function(){

    }
}
angular.module('bioSpeak.config')
    .controller('ProjectCtrl',['$scope', '$state','$stateParams','ProjectService','toaster',projectController])