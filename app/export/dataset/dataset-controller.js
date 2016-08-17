/**
 * Created by iemam on 02/10/2015.
 */

 'use strict'
    function datasetController($scope, $state, $stateParams,exportService){

        var vm = this;
        vm.fields = {};
        vm.filters = {};
        vm.fields.dataLoaded = false;
        vm.filters.dataLoaded = false;


        var projectId = $stateParams.studyId;
        var datasetId = $stateParams.datasetId;

        vm.projectId = projectId;

        
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

       


        


        if(datasetId == 0){
            console.log("new dataset")
            vm.DS = {}
            vm.DS.fields = [];
            vm.DS.filters = [];
            vm.DS.id=0;
        }else{
            exportService.getUserDataset(datasetId).then(function(data){
                vm.DS = data.ds;
            })
        }
        
    }

    angular.module('bioSpeak.export')
        .controller('datasetController',['$scope','$state','$stateParams','exportService',datasetController]);