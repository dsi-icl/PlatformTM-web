/**
 * Created by iemam on 17/05/2016.
 */
'use strict'
function AssayConfigCtrl($scope, $state, $stateParams, AssayConfigService,$timeout){
    var vm = this;
    vm.projectId = $stateParams.projectId
    console.log($stateParams.projectId)

    vm.templates={}
    vm.loaded = false;



    AssayConfigService.getAssayTerms().then(function(data){
        vm.assayTypes = data.terms;
        //console.log(vm.assayTypes)
        //updateTerms()
    })

    var updateTerms = function(){
        var selAssayType = vm.assay.type;
        //console.log(selAssayType)
        for(var i=0; i<vm.assayTypes.length; i++){
            var type = vm.assayTypes[i]
            if(type.assayTypeTerm.id == selAssayType){
                vm.assayTechTerms = type.assayTechTerms;
                vm.assayPlatTerms = type.assayPlatTerms;
            }
        }
    }
    
    vm.updateAssayTerms = updateTerms;
    
    vm.selectedDatasets = {};


    if($stateParams.assayId==0){
        console.log("New Assay")
        vm.assay = new AssayConfigService.getAssayResource();
        vm.assay.ProjectAcc = $stateParams.projectId;//"Study1"
        vm.assay.isNew = true;
        vm.assay.status = "New";
        vm.assay.datasets = {};
        vm.assay.assayId = 0;

    }

    else if($stateParams.assayId){
        console.log(AssayConfigService.getAssayResource);
        AssayConfigService.getAssayResource.get({assayId:$stateParams.assayId},function(response){
            vm.assay = response;
            vm.assay.isNew = false;
            console.log("Retrieved Assay",vm.assay.id);


            vm.selectedDatasets['sample'] = vm.assay.samplesDataset;
            vm.selectedDatasets['feature'] = vm.assay.featuresDataset;
            vm.selectedDatasets['data'] = vm.assay.observationsDataset;

            updateTerms();

        })
        // ActivityResource.get({ activityId: $stateParams.activityId }, function(response){
        //     model.activity = response;
        //     model.activity.isNew = false;
        //
        //
        //     //$scope.vmodel.activity = model.activity;
        //     vm.activity = model.activity;
        //
        //     console.log(vm.activity)
        //     console.log(model.activity)
        //     $timeout(function(){
        //         //console.log($('#ds_template_tbl'))
        //         $('#ds_template_tbl').trigger('footable_redraw');
        //     }, 1000);
        //     DatasetResource.query(function(response){
        //         vm.clinicaldomains = response;
        //     })
        //
        // });
        //temp
        /*$http.get('../data/activity.json').success(function(response){
         $scope.model.activity = response;
         })*/
    }
    
    vm.showTemplate = function(domainId,dsType){
        AssayConfigService.getDatasetResource.get({datasetId:domainId}, function(response) {
            vm.selectedDatasets[dsType] = response;
            vm.selectedDatasets[dsType].isNew = true;
            vm.selectedDatasets[dsType].activityId = $stateParams.assayId;
            vm.selectedDatasets[dsType].projectStrAcc = $stateParams.studyId;
            //vm.sampleDS.projectId = model.activity.projectId;
            //console.log(vm.selectedDatasets[dsType])
            //vm.selectedDatasets[dsType] = true;
            //vm.loaded = true;
            // $('#bs_template_tbl').trigger('footable').redraw();
            //vm.activity.datasets.push(model.dataset);
            // $timeout(function(){
            //    
            // }, 1000);

        })
    }
    
    vm.saveTemplateToAssay = function(dsType){
        vm.assay.datasets[dsType] = vm.selectedDatasets[dsType];

        if(dsType == "sample")
            vm.assay.samplesDataset = vm.selectedDatasets[dsType];
        if(dsType == "feature")
            vm.assay.featuresDataset = vm.selectedDatasets[dsType];
        if(dsType == "data")
            vm.assay.observationsDataset = vm.selectedDatasets[dsType];


        console.log('Updating',dsType, 'template');
    }
    
    vm.loadAssaySampleTemplates = function(){
        return AssayConfigService.getAssaySampleTemplates().then(function(data) {
            if (data != null && !angular.isUndefined(data)) {
                vm.templates.sample = data.templates;
            }
        })
    }
    vm.loadAssayFeatureTemplates = function(){
        return AssayConfigService.getAssayFeatureTemplates().then(function(data) {
            if (data != null && !angular.isUndefined(data)) {
                vm.templates.feature = data.templates;
            }
        })
    }
    vm.loadAssayDataTemplates = function(){
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
                console.log("Assay created",response)
                $state.transitionTo('manager.main', $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            });
        }
        else{
            console.log("Activity Edited")
             console.log(vm.selectedDatasets)
            vm.assay.samplesDataset = vm.selectedDatasets['sample'];
            vm.assay.featuresDataset = vm.selectedDatasets['feature'];
            vm.assay.observationsDataset = vm.selectedDatasets['data'];

            //TODO: REPEATED SAVE AFTER FAILING FIRST tIME WILL KEEP PUSHING TO DAtASETS
            //NEED TO REMOVE BEFORE PUSH
            
            vm.assay.datasets.push(vm.selectedDatasets['sample'])
            vm.assay.datasets.push(vm.selectedDatasets['feature'])
            vm.assay.datasets.push(vm.selectedDatasets['data'])

            vm.assay.$update(function(response) {
                console.log("Activity Updated")
                $state.transitionTo('manager.main', $stateParams, {
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
}

angular.module('bioSpeak.config')
    .controller('AssayConfigCtrl',['$scope', '$state','$stateParams','AssayConfigService','$timeout',AssayConfigCtrl])
