'use strict'
function projectController($scope, $state, $stateParams,projectService,toaster, SweetAlert,$uibModal) {
    var vm = this;
    
    vm.project = {}

    vm.ready = false;
    var project;
    vm.projectId = $stateParams.projectId;

    // if($stateParams.projectId === 'new'){
    //     console.log("New Project");
    //     project = new projectService.getProjectResource();
    //     project.isNew = true;
    //     project.status = "New";
    //     project.studies = [];
    //     vm.project = project;
    //
    //     var modalInstance = $uibModal.open({
    //         templateUrl: 'admin/project/newForm.html',
    //         controller: function ($uibModalInstance) {
    //             var modalCtrl = this;
    //             modalCtrl.ok = function () {
    //
    //                 console.log(modalCtrl.project)
    //                 vm.project.name = modalCtrl.project.name;
    //                 vm.project.title = modalCtrl.project.title;
    //                 vm.saveProject();
    //                 $uibModalInstance.close();
    //             };
    //
    //             modalCtrl.cancel = function () {
    //                 $uibModalInstance.dismiss('cancel');
    //                 vm.dontSaveProject();
    //
    //             };
    //         },
    //         controllerAs: 'modalCtrl'
    //     });
    //     vm.ready = true
    // }


    if($stateParams.projectId){
        projectService.getProjectResource.getProjectByAccession({ projectId: $stateParams.projectId },
            function(response){
                project = response;
                project.isNew = false;
                vm.project = project
                vm.ready = true
        });

        //Retrieves list of study activities
        projectService.getProjectResource.getActivitiesForProject({projectId:vm.projectId},function(response){
            vm.activities = response;
        });

        projectService.getProjectUsers(vm.projectId).then(function(users){
            vm.users = users;
        })
    }







    vm.openUpload = function() {
        console.log($stateParams)
        $state.go('datastage.upload', {dir: $stateParams.dir})
    }

    vm.goToActivity = function(activity,edit){
        if(activity.isAssay)
            $state.go('define.assay',{ projectId:vm.projectId, assayId: activity.id, edit:edit})
        else
            $state.go('define.activity',{ projectId:vm.projectId, activityId: activity.id, edit:edit})
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
        $state.go('home.dashboard');
    }

    vm.deleteProject = function(){
        console.log("project-controller: information about the relevant selected project ", vm.projectId);
        var projectId = vm.projectId;
        console.log("Project to be deleted is ", projectId);

        SweetAlert.swal({
                title: "Are you sure you want to delete "+vm.project.name+" project?",
                text: "This project including all its content will be permanently deleted! ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel it!",
                closeOnConfirm: false,
                closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {
                    projectService.deleteProject(projectId)
                        .then(function(data){
                            SweetAlert.swal("Deleted!", "Project "+vm.project.name+" has been deleted.", "success");
                            $state.go('home.dashboard');
                        })
                } else {
                    SweetAlert.swal("Cancelled", "", "error");
                }
            });
    }

    vm.addUser = function(projectId,user){
        var modalInstance = $uibModal.open({
            templateUrl: 'admin/users/user.html',
            controller: function ($uibModalInstance) {
                var userModalCtrl = this;

                this.user = user;
                // projectService.getUserClaims(userId,projectId).then(function (claims) {
                //    this.userclaims = claims;
                // });
                userModalCtrl.ok = function () {
                    //var ad = new checkoutService.getAnalysisDatasetResource();

                    //vm.saveDataset(ad);
                    // ad.$save(function(response) {
                    //     //console.log("Project created",response);
                    //     toaster.pop('success', "SUCCESS", ad.name," was successfully CREATED.",8000);
                    //
                    // });

                    $uibModalInstance.close();

                };

                userModalCtrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                    //vm.dontSaveProject();

                };
            },
            controllerAs: 'userModalCtrl'
        });
    };

    vm.editUser = function(projectId,user){
        var modalInstance = $uibModal.open({
            templateUrl: 'admin/users/user.html',
            controller: function ($uibModalInstance) {
                var userModalCtrl = this;

                this.user = user;
                // projectService.getUserClaims(userId,projectId).then(function (claims) {
                //    this.userclaims = claims;
                // });
                userModalCtrl.ok = function () {
                    //var ad = new checkoutService.getAnalysisDatasetResource();

                    //vm.saveDataset(ad);
                    // ad.$save(function(response) {
                    //     //console.log("Project created",response);
                    //     toaster.pop('success', "SUCCESS", ad.name," was successfully CREATED.",8000);
                    //
                    // });

                    $uibModalInstance.close();

                };

                userModalCtrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                    //vm.dontSaveProject();

                };
            },
            controllerAs: 'userModalCtrl'
        });
    };


    /*var uploader = vm.uploader = new FileUploader({
        url: ''//'files/projects/'+projectId+'/upload/'+$stateParams.dir
    });

    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /!*{File|FileLikeObject}*!/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });*/

}


angular.module('bioSpeak.config')
    .controller('ProjectCtrl',['$scope', '$state','$stateParams','projectService','toaster','SweetAlert','$uibModal', projectController])
