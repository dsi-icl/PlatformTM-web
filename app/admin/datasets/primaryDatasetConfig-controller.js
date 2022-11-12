/**
 * Created by iemam on 17/05/2016.
 */

'use strict';
function ActivityConfigCtrl($scope,$state, $stateParams, PrimaryDatasetConfigService,$timeout,SweetAlert,toaster,$q) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    console.log($stateParams.projectId)
    console.log($stateParams.datasetId)



    vm.selectTemplate = false;
    vm.showFieldInfo = false;
    vm.creatingCfield = false;

    $scope.$parent.vm.stateName = "Define Primary Dataset - Clinical Observations";

    vm.dataTypes = ['STRING','INTEGER','DOUBLE','DATETIME'];

    var dataset;
    if($stateParams.datasetId==0){
        console.log("New dataset");
        dataset = new PrimaryDatasetConfigService.getPrimaryDatasetResource();
        dataset.projectId = $stateParams.projectId;//"Study1"
        dataset.isNew = true;
        dataset.status = "New";
        dataset.descriptors = [];
        dataset.Id = 0;

        vm.dataset = dataset;
        PrimaryDatasetConfigService.getDatasetDescriptorResource.query({ projectId: vm.projectId },function(response){
            //console.log("querying for datasets", response)
            vm.descriptors = response;
        })
    }

    else if($stateParams.datasetId){
        PrimaryDatasetConfigService.getPrimaryDatasetResource.get({ projectId: vm.projectId, datasetId: $stateParams.datasetId }, function(response){
            dataset = response;
            dataset.isNew = false;
            dataset.descriptors = [];
            dataset.descriptors.push(dataset.descriptor);

            vm.dataset = dataset;


            $timeout(function(){
                //console.log($('#ds_template_tbl'))
                $('#ds_template_tbl').trigger('footable_redraw');
            }, 1000);

            PrimaryDatasetConfigService.getDatasetDescriptorResource.query({projectId: vm.projectId},function(response){
                vm.descriptors = response;
            })

        });
    }

    vm.fieldInfo = function(field){
        vm.showFieldInfo = true;
        vm.selField = field;
    };

    vm.saveDataset = function() {
        if (vm.dataset.title != null && vm.dataset.title !== ''){

            if (vm.dataset.isNew) {
                vm.dataset.$save({projectId:vm.projectId},function (response) {
                    toaster.pop('success', "SUCCESS", vm.dataset.title," was successfully CREATED.",8000);
                    $state.transitionTo('project.manager.main', $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            }
            else {
                vm.dataset.$update(function (response) {
                    toaster.pop('success', "SUCCESS", vm.dataset.title," was successfully UPDATED.",8000);
                    $state.transitionTo('project.manager.main', $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            }
        }else
            toaster.warning("Warning","Dataset has no name!")
    };

    vm.dontSaveActivity = function(){
        vm.dataset = {}
        $state.go('project.manager.main',{
            projectId: vm.projectId}
        );
    }

    vm.selectDescriptor = function(descriptor){
        //console.debug("CHOOSE descriptor", dataset.descriptor)
        descriptor.isNew = true;
        vm.dataset.descriptorId = descriptor.id;
        vm.dataset.descriptors.push(descriptor);
        vm.dataset.descriptor = descriptor;

        $timeout(function(){
            console.log(vm.dataset.descriptors.length - 1);
            vm.activeTabIndex = (vm.dataset.descriptors.length - 1);
            //console.log(vm.activeTabIndex);
            //$scope.$apply();
        });
            //console.log(vm.activity)

            $timeout(function(){
                //console.log($('#ds_template_tbl'))
                $('#ds_template_tbl').trigger('footable_redraw');
            });
    };

    vm.showDescriptorFields = function(descriptor) {
        vm.showDS = descriptor;
    }

    vm.tabSelected = function(ds){
        vm.currDS = ds;
    };

    vm.deleteDS = function(){

        SweetAlert.swal({
                title: "Are you sure you want to delete "+vm.currDS.name+"?",
                text: "All associated data files will be deleted and all loaded data attached to this data will be permanently deleted! ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {
                    var pos;
                    for(var i=0; i< vm.activity.datasets.length;i++) {
                        console.log(i)
                        if(vm.currDS.id === vm.activity.datasets[i].id){
                            console.log(i, 'for',vm.currDS.name)
                            pos = i;
                            break;
                        }
                    }
                    vm.activity.datasets.splice(pos,1)
                    SweetAlert.swal("Deleted!", "Dataset "+vm.currDS.name+" has been deleted.", "success");
                } else {
                    SweetAlert.swal("Cancelled", "", "error");
                }
            });
    }
}

angular.module('bioSpeak.config')
    .controller('ActivityConfigCtrl',['$scope','$state','$stateParams','PrimaryDatasetConfigService','$timeout','SweetAlert','toaster','$q',ActivityConfigCtrl]);
