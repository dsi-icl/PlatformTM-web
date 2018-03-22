/**
 * Created by iemam on 06/04/2017.
 */
'use strict'
function dashboardController($state,projectService, exportService, explorerService, checkoutService,SweetAlert ) {
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

    // exportService.getUserDatasets().then(function(response){
    //     vm.datasets = response.datasets;
    //     console.log(vm.datasets.length)
    //     vm.loaded = true;
    // });

    // explorerService.getUserQueries(vm.projectId).then(function(response){
    //     //console.log(response);
    //     vm.queries = response.queries;
    // });

    vm.refreshDatasets = function(){
        exportService.getUserDatasets().then(function(response){
            vm.datasets = response.datasets;
            //console.log(vm.datasets.length)
            vm.loaded = true;
        });
    };

    vm.goToActivity = function(activity,edit){
        if(activity.isAssay)
            $state.go('admin.assay',{ projectId:vm.projectId, assayId: activity.id, edit:edit})
        else
            $state.go('admin.activity',{ projectId:vm.projectId, activityId: activity.id, edit:edit})
    }

    vm.downloadDataset = function(ds){
        if(ds.fileStatus === 0){
            ds.fileStatus = 1;
            checkoutService.prepareDataset(ds.id);
            vm.refreshDatasets();
        }else if(ds.fileStatus === 2)
            checkoutService.downloadDataset(ds.id);

    }


    vm.deleteDataset = function(datasetId) {
        SweetAlert.swal({
                title: "Are you sure you want to delete this dataset ?",
                text: "Dataset will be permanently deleted! ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plz!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    exportService.deleteDataset(datasetId)
                        .then(function (data) {
                            SweetAlert.swal("Deleted!");
                            vm.refreshDatasets();
                        })
                } else {
                    SweetAlert.swal("Cancelled", "", "error");
                }
            });


    }



}
angular.module('biospeak.app')
    .controller('DashboardCtrl',['$state','projectService','exportService','explorerService','checkoutService', 'SweetAlert',dashboardController])