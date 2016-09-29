/**
 * Created by iemam on 02/10/2015.
 */

 'use strict'
    function datasetController($rootScope,$scope, $state, $stateParams,exportService){

        var vm = this;
        vm.fields = {};
        vm.filters = {};
        vm.fields.dataLoaded = false;
        vm.filters.dataLoaded = false;


        var projectId = $stateParams.projectId;
        var datasetId = $stateParams.datasetId;
        vm.dsRetrieved = false;

        vm.projectId = projectId;
        /*vm.DS ={}
        
        if(datasetId == 0){
            console.log("new dataset")
            vm.DS = new exportService.getMyDatasetResource();
            vm.DS.fields = [];
            vm.DS.filters = [];
            vm.DS.id=0;
            vm.DS.projectId = projectId
            vm.DS.type = "Clinical Data";
            vm.DS.isNew = true;
        }else{
            exportService.getMyDatasetResource.get({datasetId:datasetId},function(response) {
                vm.DS = response;
                vm.DS.isNew = false;
                vm.dsRetrieved = true
                console.log("Retrieved User Dataset",vm.DS.id);
                exportService.updateLocalDS(vm.DS).then(function () {
                    /!*$state.go('export.wizard.filters', {
                        datasetId: datasetId,
                        projectId: projectId
                    });*!/
                });
            })
        }*/
        
        // exportService.getDataFields(projectId).then(function(data){
        //     vm.fields.treeConfig = {
        //         core : {
        //             multiple : true,
        //             animation: true,
        //             error : function(error) {
        //                 $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
        //             },
        //             themes:{
        //                 dots:false,
        //                 icons:false,
        //                 stripes:true
        //             },
        //             check_callback : false,
        //             worker : true
        //         },
        //         defaults: {},
        //         checkbox:{
        //             three_state:true//,
        //             //visible:false
        //         },
        //         state : { key : "step1" },
        //         types : {
        //             default : {
        //                 icon : 'glyphicon glyphicon-flash'
        //             },
        //             star : {
        //                 icon : 'glyphicon glyphicon-star'
        //             },
        //             cloud : {
        //                 icon : 'glyphicon glyphicon-cloud'
        //             }
        //         },
        //         version : 1,
        //         plugins : ['checkbox','changed','state','search']
        //     };
        //     vm.filters.treeConfig = {
        //         core : {
        //             multiple : true,
        //             animation: true,
        //             error : function(error) {
        //                 $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
        //             },
        //             themes:{
        //                 dots:false,
        //                 icons:false,
        //                 stripes:true
        //             },
        //             check_callback : false,
        //             worker : true
        //         },
        //         defaults: {},
        //         checkbox:{
        //             three_state:true//,
        //             //visible:false
        //         },
        //         state : { key : "step2" },
        //         types : {
        //             default : {
        //                 icon : 'glyphicon glyphicon-flash'
        //             },
        //             star : {
        //                 icon : 'glyphicon glyphicon-star'
        //             },
        //             cloud : {
        //                 icon : 'glyphicon glyphicon-cloud'
        //             }
        //         },
        //         version : 1,
        //         plugins : ['checkbox','changed','state','search']
        //     };
        //     vm.fields.treeData = data.fields;
        //     vm.filters.treeData = data.fields;
        //     vm.dataLoaded = true;
        //     vm.fields.treeConfig.version++;
        //     vm.filters.treeConfig.version++;
        // })
    }

    angular.module('bioSpeak.export')
        .controller('datasetController',['$rootScope','$scope','$state','$stateParams','exportService',datasetController]);