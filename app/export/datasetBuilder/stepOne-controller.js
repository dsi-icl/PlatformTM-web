/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepOneController($scope,$state,$stateParams,datasetService){

        var vm = this;

        var projectId = $stateParams.studyId
        //datasetService.getDataFields(projectId).then(function(data){
        //    vm.treeData = data.fields;
        //})


        vm.treeData =   [
            { id : 'ajson1', parent : '#', text : 'Simple root node', state: { opened: true} },
            { id : 'ajson2', parent : '#', text : 'Root node 2', state: { opened: true} },
            { id : 'ajson3', parent : 'ajson2', text : 'Child 1', state: { opened: true} },
            { id : 'ajson4', parent : 'ajson2', text : 'Child 2' , state: { opened: true}}
        ]

        vm.treeConfig = {
            core : {
                multiple : true,
                animation: true,
                error : function(error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                themes:{
                  dots:false,
                    icons:false,
                    stripes:true
                },
                check_callback : false,
                worker : true
            },
            types : {
                default : {
                    icon : 'glyphicon glyphicon-flash'
                },
                star : {
                    icon : 'glyphicon glyphicon-star'
                },
                cloud : {
                    icon : 'glyphicon glyphicon-cloud'
                }
            },
            version : 1,
            plugins : ['checkbox','changed']
        };




/*        vm.treeEventsObj = {
            'ready': readyCB,
            'select_node': nodeSelected,
            'changed.jstree':selectChanged
        }*/



        vm.selFields = [];


        //$scope.selFields = _selFields
/*        $scope.$watch('fldCtrl.selFields',function (newval) {
            console.log("INSIDE WATCH",newval)
            vm.fields = newval//$scope.selFields;


        },true)*/

        vm.nodeSelected = function (node,selected,event) {
            //console.log('node selected',node,selected,event);
        };

        vm.nodeDeselected = function (node,selected,event) {
            //console.log('node deselected',node,selected,event);
        };

        vm.treeChanged = function (event,data){

            var i, j;
            vm.selFields = []
            for(i = 0, j = data.selected.length; i < j; i++) {
                vm.selFields.push(data.instance.get_node(data.selected[i]));
            }
            $scope.$apply();
            //vm.selFields = _selFields;
            console.log('selectChanged',vm.selFields);
        }


        vm.goToStep2 = function(){
            //$scope.vm.selectedDataset.dataFileDTO = $scope.$parent.vm.fileSelected //fileDTO
            //
            datasetService.saveFields(user,vm.selFields)
                .then(function(){
                    $state.go('dataset.wizard.step_two',{
                        datasetId: 0,
                        projectId: 'P-BVS'
                    });
            })

        }



    }

    angular.module('bioSpeak.export')
        .controller('stepOneController',['$scope','$state','$stateParams','datasetService',stepOneController]);
