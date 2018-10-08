/**
 * Created by iemam on 06/04/2017.
 */
'use strict'
function dashboardController($state,$uibModal,projectService ) {
    var vm = this;

    var date = new Date();
    var hrs = date.getHours();
    var greet;
    if(hrs<12)
        vm.greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17)
        vm.greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24)
        vm.greet = 'Good Evening';

    vm.projects = {}

    projectService.getProjectResource.get(function(response){
        vm.projects = response;
    });

    vm.createProject = function () {

        var project = new projectService.getProjectResource();
        project.isNew = true;
        project.status = "New";
        project.studies = [];
        vm.project = project;

        var modalInstance = $uibModal.open({
            templateUrl: 'home/newProjectForm.html',
            controller: function ($uibModalInstance) {
                var modalCtrl = this;
                modalCtrl.ok = function () {
                    vm.project.name = modalCtrl.project.name;
                    vm.project.title = modalCtrl.project.title;

                    if(vm.project.name && vm.project.title){
                        vm.project.$save(function(response) {

                            $state.go('project.manager.main',{projectId:response.id});
                        });
                    }

                    $uibModalInstance.close();
                };

                modalCtrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            controllerAs: 'newCtrl'
        });
    }

    vm.joinProject = function () {


        var modalInstance = $uibModal.open({
            templateUrl: 'home/joinProjectForm.html',
            controller: function ($uibModalInstance) {
                var modalCtrl = this;
                modalCtrl.ok = function () {
                    //joinCtrl.projectCode;

                    // if(modalCtrl.projectCode!==''){
                    //     projService.getProjectResource.getProjectByAccession({projectId: modalCtrl.projectCode},
                    //         function (response) {
                    //             vm.project = response;
                    //             if(response)
                    //                 projService.
                    //         });
                    // }

                    $uibModalInstance.close();
                };

                modalCtrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            controllerAs: 'joinCtrl'
        });
    }


}
angular.module('biospeak.app')
    .controller('DashboardCtrl',['$state','$uibModal','projectService',dashboardController])