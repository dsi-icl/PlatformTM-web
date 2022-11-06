/**
 * Created by iemam on 17/05/2016.
 */

'use strict';
function DescriptorCtrl($scope,$state, $stateParams,$filter, DescriptorCtrlService,$timeout,SweetAlert,toaster,$q) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.descriptorId = $stateParams.descriptorId;

    vm.loadedDescriptor = $stateParams.json;
    console.log(vm.loadedDescriptor);


    vm.ddTypes = [
        {value: 1, text: 'Subject Dataset Type'},
        {value: 2, text: 'Observation Dataset Type'},
        {value: 3, text: 'Feature Dataset Type'},
        {value: 4, text: 'Biosample Dataset Type'}
    ];

    vm.fieldTypes = [
        {value: 1, text: 'Identifier Field'},
        {value: 2, text: 'Designation Field'},
        {value: 3, text: 'Classifier Field'},
        {value: 4, text: 'Property Field'},
        {value: 4, text: 'Property Value Field'},
        {value: 4, text: 'Time Series Field'}
    ];



    vm.selectTemplate = false;
    vm.showFieldInfo = false;
    vm.creatingCfield = false;

    $scope.$parent.vm.stateName = "Define Dataset Descriptor";

    vm.dataTypes = ['STRING','INTEGER','DOUBLE','DATETIME'];
    vm.varTypes = ['SUBMITTED','DERIVED'];
    vm.roleTypes = ['Observation Qualifier','Finding about observation']

    vm.dictTerms = ['MILD','SEVERE','MODERATE'];
    vm.expressionList = [];


    vm.openUpload = function(){
        $state.go('define.descriptor.upload')
    };

    var activity;
    if($stateParams.descriptorId==0){
        console.log("New Activity");
        vm.dd = $stateParams.json;
        // activity = new ActivityConfigService.getActivityResource();
        // activity.projectId = $stateParams.projectId;//"Study1"
        // activity.isNew = true;
        // activity.status = "New";
        // activity.datasets = [];
        // activity.activityId = 0;
        //
        // vm.activity = activity;
        // ActivityConfigService.getDatasetResource.query(function(response){
        //     //console.log("querying for datasets", response)
        //     vm.clinicaldomains = response;
        // })
    }

    else if($stateParams.descriptorId){
        // ActivityConfigService.getActivityResource.get({ activityId: $stateParams.activityId }, function(response){
        //     activity = response;
        //     activity.isNew = false;
        //
        //     vm.dd = activity;
        //
        //     $timeout(function(){
        //         //console.log($('#ds_template_tbl'))
        //         $('#ds_template_tbl').trigger('footable_redraw');
        //     }, 1000);
        //
        //     ActivityConfigService.getDatasetResource.query(function(response){
        //         vm.clinicaldomains = response;
        //     })
        //
        // });
    }
    vm.showDDtype = function() {
        if(!vm.dd)
            return 'Not set'
        var selected = $filter('filter')(vm.ddTypes, {value: vm.dd.type});
        return (vm.dd.type && selected.length) ? selected[0].text : 'Not set';
    };

    vm.showFieldType = function(field) {
        var selected = [];
        if(field.fieldType) {
            selected = $filter('filter')(vm.fieldTypes, {value: field.fieldType});
        }
        return selected.length ? selected[0].text : 'Not set';
    };


    // save edits
    vm.updateFields = function() {
        var results = [];
        for (var i = vm.dd.fields.length; i--;) {
            var field = vm.dd.fields[i];
           // console.log(field);
            // actually delete user
            // if (user.isDeleted) {
            //     $scope.users.splice(i, 1);
            // }
            // mark as not new
            if (field.isNew) {
                field.isNew = false;
            }

            // send on server
            //results.push($http.post('/saveUser', user));
        }

        return $q.all(results);
    };


    vm.createNewCfield = function(){
        if(vm.creatingCfield){
            //vm.creatingCfield = true;
            vm.cField = {}

            vm.cField.isSelected = true;
            vm.cField.isRequired = false;
            vm.cField.isCurated = false;
            //vm.cField.dictionaryName = null;
            //cField.order
        }
        //console.log(vm.cField);
        vm.showFieldInfo = false;
        vm.selField = {};

    };

    vm.cancelAddVariableToDS = function(){
        vm.creatingCfield = false;
        vm.clearExpression();
        console.log('canceling cfield')

    };

    vm.addVariableToDS = function(){

        if(vm.cField.name){
            vm.cField.accession = 'V-COMP-' + vm.activity.datasets[0].code+'-'+vm.cField.name;
            vm.cField.roleId = 'CL-Role-T-3';
            vm.cField.projectId = vm.projectId;
            vm.isCurated = false;

            //console.log(vm.activity)
            //if(!vm.cField.usingFunc)

            this.finalizeExpression()

            vm.cField.expressionList = vm.expressionList
            console.log(vm.cField)

            if(vm.cField.varType === 'DERIVED')
                vm.cField.isComputed = true;
            vm.activity.datasets[0].variables.push(vm.cField)
            toaster.pop('success', "SUCCESS", vm.cField.name+" has been added to dataset template successfully.",8000);
            vm.cField = {};
            vm.expressionList = [];
        }
        else {
                toaster.warning("Warning","No variable added to dataset template")
        }

        
    };


    vm.saveActivity = function() {
        if (vm.activity.name != null && vm.activity.name !== ''){

            if (vm.activity.isNew) {
                vm.activity.$save(function (response) {
                    toaster.pop('success', "SUCCESS", vm.activity.name," was successfully CREATED.",8000);
                    $state.transitionTo('project.manager.main', $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            }
            else {
                vm.activity.$update(function (response) {
                    toaster.pop('success', "SUCCESS", vm.activity.name," was successfully UPDATED.",8000);
                    $state.transitionTo('project.manager.main', $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            }
        }else
            toaster.warning("Warning","Activity has no name!")
    };

    vm.dontSaveActivity = function(){
        vm.activity = {}
        $state.go('project.manager.main',{
            projectId: vm.projectId}
        );
    }



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
    .controller('DescriptorCtrl',['$scope','$state','$stateParams','$filter','DescriptorService','$timeout','SweetAlert','toaster','$q',DescriptorCtrl]);
