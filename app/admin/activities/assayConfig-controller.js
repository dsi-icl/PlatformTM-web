/**
 * Created by iemam on 17/05/2016.
 */
'use strict'
function AssayConfigCtrl($scope, $state, $stateParams, AssayConfigService, toaster, SweetAlert){
    var vm = this;
    vm.projectId = $stateParams.projectId
    vm.assayId = $stateParams.assayId;

    vm.templates={}
    vm.loaded = true;

    vm.featuresVM = {}
    vm.samplesVM = {}
    vm.dataVM = {}

    vm.newField= {};

    $scope.$parent.vm.stateName = "Define Assay";

    AssayConfigService.getAssayTerms().then(function(data){
        vm.assayTypes = data.terms;
        //console.log(vm.assayTypes)
        //updateTerms()
    });

    vm.genericFields = ['Reporter Database Entry','Reporter Group','Composite Element Database Entry','Composite Element Comment']

    vm.refsources = ['RefSeq','genbank'];

    var updateTerms = function(){
        var selAssayType = vm.assay.type;
        //console.log(selAssayType)
        for(var i=0; i<vm.assayTypes.length; i++){
            var type = vm.assayTypes[i]
            if(type.assayTypeTerm.id === selAssayType){
                vm.assayTechTerms = type.assayTechTerms;
                vm.assayPlatTerms = type.assayPlatTerms;
            }
        }
    };
    
    vm.updateAssayTerms = updateTerms;
    
    vm.selectedDatasets = {};

var assay;
    if($stateParams.assayId==0){
        console.log("New Assay")
        assay = new AssayConfigService.getAssayResource();
        assay.projectId = $stateParams.projectId;//"Study1"
        assay.isNew = true;
        assay.status = "New";
        assay.datasets = [];
        assay.assayId = 0;

        vm.assay = assay;
    }

    else if($stateParams.assayId){
        //console.log(AssayConfigService.getAssayResource);
        AssayConfigService.getAssayResource.get({assayId:$stateParams.assayId},function(response){
            vm.assay = response;
            vm.assay.isNew = false;
            //console.log("Retrieved Assay",vm.assay.id);


            vm.selectedDatasets['sample'] = vm.assay.samplesDataset;
            vm.selectedDatasets['feature'] = vm.assay.featuresDataset;
            vm.selectedDatasets['data'] = vm.assay.observationsDataset;

            updateTerms();
        })
    }
    
/*    vm.showTemplate = function(domainId,dsType){
        AssayConfigService.getDatasetResource.get({datasetId:domainId}, function(response) {
            vm.selectedDatasets[dsType] = response;
            vm.selectedDatasets[dsType].isNew = true;
            vm.selectedDatasets[dsType].activityId = $stateParams.assayId;
            vm.selectedDatasets[dsType].projectStrAcc = vm.projectId;

            console.log(vm.selectedDatasets[dsType])
        })
    };*/

    vm.setSamplesDS = function(dataset){
        dataset.isNew = true;
        dataset.activityId = $stateParams.activityId;
        dataset.projectStrAcc = vm.projectId;
        vm.assay.samplesDataset = dataset
    }
    vm.setFeaturesDS = function(dataset){
        AssayConfigService.getDatasetResource.get({datasetId:dataset.domainId}, function(dataset) {
            dataset.isNew = true;
            dataset.activityId = $stateParams.activityId;
            dataset.projectStrAcc = vm.projectId;
            dataset.projectId = vm.projectId;
            vm.assay.featuresDataset = dataset;
        })

    }
    vm.setDataDS = function(dataset){
        dataset.isNew = true;
        dataset.activityId = $stateParams.activityId;
        dataset.projectStrAcc = vm.projectId;
        vm.assay.observationsDataset = dataset
    }


    vm.addField = function(dataset){
        //var newField = dataset.newField;
        var newField = angular.copy(dataset.newField)

        //console.log('before',dataset.genericFields)
        if(newField.isGeneric && dataset.newFieldQualifier != null)
            newField.name = newField.name + '['+dataset.newFieldQualifier[0]+']';
        newField.label = newField.name;

        dataset.variables.push(newField);
        dataset.newField = null;
        dataset.newFieldQualifier = null;

    }


    vm.loadAssaySampleTemplates = function(){
        if(!vm.templates.sample)
            return AssayConfigService.getAssaySampleTemplates().then(function(data) {
                if (data != null && !angular.isUndefined(data)) {
                    vm.templates.sample = data.templates;
                }
            })
    }

    vm.loadAssayFeatureTemplates = function(){
        if(!vm.templates.feature)
            return AssayConfigService.getAssayFeatureTemplates().then(function(data) {
                if (data != null && !angular.isUndefined(data)) {
                    vm.templates.feature = data.templates;
                }
            })
    }

    vm.loadAssayDataTemplates = function(){
        if(!vm.templates.data)
            return AssayConfigService.getAssayDataTemplates().then(function(data) {
                if (data != null && !angular.isUndefined(data)) {
                    vm.templates.data = data.templates;
                }
            })
    }


    vm.saveAssay = function(){
        if(vm.assay.isNew){
            console.log(vm.assay)

            vm.assay.$save(function(response) {
                //console.log("Assay created",response)
                toaster.pop('success', "SUCCESS", vm.assay.name," was successfully CREATED.",8000);
                $state.transitionTo('project.manager.main', $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            });
        }
        else{
            //console.log("Assay Edited")
            // console.log(vm.selectedDatasets)
            //vm.assay.samplesDataset = vm.selectedDatasets['sample'];
            //vm.assay.featuresDataset = vm.selectedDatasets['feature'];
            //vm.assay.observationsDataset = vm.selectedDatasets['data'];

            //TODO: REPEATED SAVE AFTER FAILING FIRST tIME WILL KEEP PUSHING TO DAtASETS
            //NEED TO REMOVE BEFORE PUSH
            
            //vm.assay.datasets.push(vm.selectedDatasets['sample'])
            //vm.assay.datasets.push(vm.selectedDatasets['feature'])
            //vm.assay.datasets.push(vm.selectedDatasets['data'])

            vm.assay.$update(function(response) {
                toaster.pop('success', "SUCCESS", vm.assay.name," was successfully UPDATED.",8000);
                $state.transitionTo('project.manager.main', $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            });
        }

        //console.log($stateParams)
        //$state.go('manager.activities.detail',$stateParams,{
        //    reload: true,
        //    inherit: false
        //    });
    }

    vm.dontSaveAssay = function(){
        vm.assay = {};
        $state.go('project.manager.main',{
            projectId: vm.projectId}
        );
    }

    vm.deleteDS = function(dataset){

        SweetAlert.swal({
                title: "Are you sure you want to delete "+dataset.name+" dataset ?",
                text: "All associated data files will be deleted and all loaded data attached to this dataset will be permanently deleted! ",
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
    .controller('AssayConfigCtrl',['$scope', '$state','$stateParams','AssayConfigService','toaster','SweetAlert',AssayConfigCtrl])
