/**
 * Created by iemam on 17/05/2016.
 */

'use strict';
function DescriptorCtrl($scope,$state, $stateParams,$filter, DescriptorService,$timeout,SweetAlert,toaster,$q) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.descriptorId = $stateParams.descriptorId;

    vm.loadedDescriptor = $stateParams.json;
    // console.log(vm.loadedDescriptor);
    vm.ready=false;


    vm.ddTypes = [
        {value: "SubjectDatasetDescriptor", text: 'Subject Dataset Descriptor'},
        {value: "ObservationDatasetDescriptor", text: 'Observation Dataset Descriptor'},
        {value: "FeatureDatasetDescriptor", text: 'Feature Dataset Descriptor'},
        {value: "SampleDatasetDescriptor", text: 'Biosample Dataset Descriptor'}
    ];

    vm.fieldTypes = [
        {value: "0", text: 'Identifier Field'},
        {value: "1", text: 'Designation Field'},
        {value: "2", text: 'Classifier Field'},
        {value: "3", text: 'Property Field'},
        {value: "4", text: 'Property Value Field'},
        {value: "5", text: 'Time Series Field'}
    ];



    vm.selectTemplate = false;
    vm.showFieldInfo = false;
    vm.creatingCfield = false;

    $scope.$parent.vm.stateName = "Define Dataset Descriptor";

    // vm.dictTerms = ['MILD','SEVERE','MODERATE'];
    // vm.expressionList = [];


    vm.openUpload = function(){
        $state.go('define.descriptor.upload')
    };

    var descriptor;


    if($stateParams.descriptorId==0){
        console.log("New Activity");
        //vm.dd = $stateParams.json;
        descriptor = new DescriptorService.getDDescriptorResource();
        descriptor.projectId = $stateParams.projectId;
        descriptor.isNew = true;
        descriptor.hasData = false;
        descriptor.status = "New";
        descriptor.fields = [];
        descriptor.descriptorId = 0;
        //
        vm.dd = descriptor;
        vm.ready= true;
        // ActivityConfigService.getDatasetResource.query(function(response){
        //     //console.log("querying for datasets", response)
        //     vm.clinicaldomains = response;
        // })
    }else if($stateParams.descriptorId == "upload" && $stateParams.json){

        vm.dd = $stateParams.json;

        vm.dd.isNew = true;
        vm.dd.hasData = true;
        vm.dd.idfields = [];
        vm.dd.roFields = [];
        vm.dd.featFields = [];
        vm.dd.idfields.push(vm.dd.studyIdentifierField);
        vm.dd.idfields.push(vm.dd.subjectIdentifierField);

        for(var f of vm.dd.observedPropertyValueFields)
            vm.dd.roFields.push(f);

        for(var ff of vm.dd.observationPropertyFields)
            vm.dd.roFields.push(ff);

        vm.dd.featFields.push(vm.dd.featureNameField);
        if(vm.dd.featurePropertyNameField != null) vm.dd.featFields.push(vm.dd.featurePropertyNameField);
        if(vm.dd.featurePropertyValueField != null) vm.dd.featFields.push(vm.dd.featurePropertyValueField);

        vm.complete = true;
        vm.ready = true;


    }

    else if($stateParams.descriptorId){
        DescriptorService.getDDescriptorResource.getDescriptor({ descriptorId: vm.descriptorId }, function(response){
            vm.dd = response;
            vm.dd.isNew = false;
            vm.intiDescriptor();

            $timeout(function(){
                //console.log($('#ds_template_tbl'))
                $('#ds_template_tbl').trigger('footable_redraw');
            }, 1000);
        });
    }
    else{
        vm.dd = new DescriptorService.getDDescriptorResource();
        vm.ready = true;
    }

    vm.intiDescriptor = function(){
        vm.dd.hasData = true;
        vm.dd.idfields = [];
        vm.dd.roFields = [];
        vm.dd.featFields = [];
        vm.dd.idfields.push(vm.dd.studyIdentifierField);
        vm.dd.idfields.push(vm.dd.subjectIdentifierField);

        for(var f of vm.dd.observedPropertyValueFields)
            vm.dd.roFields.push(f);

        for(var ff of vm.dd.observationPropertyFields)
            vm.dd.roFields.push(ff);

        vm.dd.featFields.push(vm.dd.featureNameField);
        if(vm.dd.featurePropertyNameField != null) vm.dd.featFields.push(vm.dd.featurePropertyNameField);
        if(vm.dd.featurePropertyValueField != null) vm.dd.featFields.push(vm.dd.featurePropertyValueField);

        vm.complete = true;
        vm.ready = true;
    }

    vm.showDDtype = function() {
        var selected = [];
        if(vm.dd)
        if(vm.dd.datasetType){
            selected = $filter('filter')(vm.ddTypes, {value: vm.dd.datasetType});
        }
        return selected.length ? selected[0].text : 'Not set';
    };

    vm.showFieldType = function(field) {
        var selected = [];


        selected = $filter('filter')(vm.fieldTypes, {value: field.fieldType});


        return selected.length ? selected[0].text : 'Not set';
    };

    //Discard Changes
    vm.discardChanges = function() {
        // for (var i = $scope.users.length; i--;) {
        //     var user = $scope.users[i];
        //     // undelete
        //     if (user.isDeleted) {
        //         delete user.isDeleted;
        //     }
        //     // remove new
        //     if (user.isNew) {
        //         $scope.users.splice(i, 1);
        //     }
        // };
    };

    // save edits
    vm.applyChanges = function() {
        //console.log(vm.dd);
        var results = [];
        for (var i = vm.dd.roFields.length; i--;) {
            var field = vm.dd.roFields[i];
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

    vm.newField = function() {
        vm.dd.fields.push({
            id: vm.dd.fields.length+1,
            name: '',
            label: '',
            description: '',
            fieldType: null
        });
    };

    vm.saveDescriptor = function() {
        if($scope.tableform.$visible){
            toaster.warning("Warning","Save or discard changes before saving")
        }else{
            if (vm.dd.title != null && vm.dd.title !== '' && vm.dd.hasData){

                if (vm.dd.isNew) {
                    DescriptorService.saveDescriptor(vm.dd,vm.projectId).then(function (response) {

                        toaster.pop('success', "SUCCESS", vm.dd.name," was successfully CREATED.",8000);
                        $state.transitionTo('define.descriptor', $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true,
                            descriptorId: response.id
                        });
                    });
                }
                else {
                    vm.dd.$update(function (response) {
                        toaster.pop('success', "SUCCESS", vm.dd.name," was successfully UPDATED.",8000);
                        // $state.transitionTo('project.manager.main', $stateParams, {
                        //     reload: true,
                        //     inherit: false,
                        //     notify: true
                        // });
                        vm.updateSuccess()
                    });
                }
            }else
                toaster.warning("Warning","Descriptor has no name and/or fields defined!")
        }

    };

    // vm.createNewCfield = function(){
    //     if(vm.creatingCfield){
    //         //vm.creatingCfield = true;
    //         vm.cField = {}
    //
    //         vm.cField.isSelected = true;
    //         vm.cField.isRequired = false;
    //         vm.cField.isCurated = false;
    //         //vm.cField.dictionaryName = null;
    //         //cField.order
    //     }
    //     //console.log(vm.cField);
    //     vm.showFieldInfo = false;
    //     vm.selField = {};
    //
    // };

    // vm.cancelAddVariableToDS = function(){
    //     vm.creatingCfield = false;
    //     vm.clearExpression();
    //     console.log('canceling cfield')
    //
    // };

    // vm.addVariableToDS = function(){
    //
    //     if(vm.cField.name){
    //         vm.cField.accession = 'V-COMP-' + vm.activity.datasets[0].code+'-'+vm.cField.name;
    //         vm.cField.roleId = 'CL-Role-T-3';
    //         vm.cField.projectId = vm.projectId;
    //         vm.isCurated = false;
    //
    //         //console.log(vm.activity)
    //         //if(!vm.cField.usingFunc)
    //
    //         this.finalizeExpression()
    //
    //         vm.cField.expressionList = vm.expressionList
    //         console.log(vm.cField)
    //
    //         if(vm.cField.varType === 'DERIVED')
    //             vm.cField.isComputed = true;
    //         vm.activity.datasets[0].variables.push(vm.cField)
    //         toaster.pop('success', "SUCCESS", vm.cField.name+" has been added to dataset template successfully.",8000);
    //         vm.cField = {};
    //         vm.expressionList = [];
    //     }
    //     else {
    //             toaster.warning("Warning","No variable added to dataset template")
    //     }
    // };




    vm.dontSaveActivity = function(){
        vm.activity = {}
        $state.go('project.manager.main',{
            projectId: vm.projectId}
        );
    }

    vm.updateSuccess = function(){
        SweetAlert.swal({
                title: "Success",
                text: "Dataset Descriptor Updated Successfully",
                type: "success",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Go back",
                cancelButtonText: "Remain on this page",
                closeOnConfirm: true,
                closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    $state.transitionTo('project.manager.main', $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });

                } else {

                }
            });
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
