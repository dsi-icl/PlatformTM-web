/**
 * Created by iemam on 06/10/2015.
 */
'use strict';
function stepThreeTreeController($scope, $state, $stateParams,$timeout,datasetService){


    var vm = this;

    var projectId = $stateParams.studyId;
    var newId = 1;

    vm.dataLoaded = false;
    vm.ignoreChanges = false;
    vm.newNode = {};


    vm.treeConfig = {
        core : {
            multiple : false,
            animation: true,
            error : function(error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback : true,
            worker : true
        },
        types : {
            /*default : {
             icon : 'glyphicon glyphicon-flash'
             },*/
            char : {
                icon : "./img/char.jpg"//'glyphicon glyphicon-star'
            },
            numeric : {
                icon : './img/numeric.jpg'//'glyphicon glyphicon-cloud'
            }
        },
        version : 1,
        plugins : ['types','dnd']
    };

    datasetService.getTreeData(projectId,function(data){
        vm.originalData = data
        vm.treeData = [];
        angular.copy(vm.originalData,vm.treeData);
        vm.dataLoaded = true
        vm.treeConfig.version++;
    })

    //datasetService.getTreeData([], "P-BVS", function(data){
    //
    //    vm.originalData = data
    //
    //    vm.treeData = [];
    //
    //    angular.copy(vm.originalData,vm.treeData);
    //    vm.treeConfig = {
    //        core : {
    //            multiple : false,
    //            animation: true,
    //            error : function(error) {
    //                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
    //            },
    //            check_callback : true,
    //            worker : true
    //        },
    //        types : {
    //            default : {
    //                icon : 'glyphicon glyphicon-flash'
    //            },
    //            star : {
    //                icon : 'glyphicon glyphicon-star'
    //            },
    //            cloud : {
    //                icon : 'glyphicon glyphicon-cloud'
    //            }
    //        },
    //        version : 1,
    //        plugins : ['types','dnd']
    //    };
    //
    //
    //    vm.reCreateTree = function() {
    //        vm.ignoreChanges = true;
    //        angular.copy(this.originalData,this.treeData);
    //        vm.treeConfig.version++;
    //    };
    //
    //    vm.simulateAsyncData = function() {
    //        vm.promise = $timeout(function(){
    //            vm.treeData.push({ id : (newId++).toString(), parent : vm.treeData[0].id, text : 'Async Loaded' })
    //        },3000);
    //    };
    //
    //    vm.addNewNode = function() {
    //        vm.treeData.push({ id : (newId++).toString(), parent : vm.newNode.parent, text : vm.newNode.text });
    //    };
    //
    //
    //})



    vm.updateTree = function (){
        var newTree = []
        var tree = vm.treeInstance.jstree(true).get_json('#', { 'flat': true })

        angular.forEach(tree, function(obj, key){
            var treeElement ={}
            treeElement['id'] = obj['id']
            treeElement['parent'] = obj['parent']
            treeElement['text'] = obj['text']
            var state = obj['state']
            var newState = {}
            newState['opened'] = state['opened']
            treeElement['state'] = newState
            newTree.push(treeElement)
        })

        treeService.sendData([], "P-BVS", newTree)

    }

    vm.setNodeType = function() {
        var item = _.findWhere(this.treeData, { id : this.selectedNode } );
        item.type = this.newType;
        // toaster.pop('success', 'Node Type Changed', 'Changed the type of node ' + this.selectedNode);
    };

    vm.readyCB = function() {
        $timeout(function() {
            vm.ignoreChanges = false;
            //vm.dataLoaded = true;
            //   toaster.pop('success', 'JS Tree Ready', 'Js Tree issued the ready event')
        });
    };

    vm.createCB  = function(e,item) {
        //$timeout(function() {toaster.pop('success', 'Node Added', 'Added new node with the text ' + item.node.text)});
    };

    vm.applyModelChanges = function() {
        return !vm.ignoreChanges;
    };

    vm.addNewNode = function() {
             vm.treeData.push({ id : (newId++).toString(), parent : vm.newNode.parent, text : vm.newNode.text });
    };

    vm.createNode = function(){
        var selNode = vm.treeInstance.jstree(true).get_selected();
        if(!selNode.length) { return false; }
        selNode = selNode[0];
        selNode = vm.treeInstance.jstree(true).create_node(selNode, {"type":"group"});
        if(selNode) {
            vm.treeInstance.jstree(true).edit(selNode);
        }
    }


    vm.rename = function() {
        var selNode = vm.treeInstance.jstree(true).get_selected();
        if(!selNode.length) { return false; }
        selNode = selNode[0];
        vm.treeInstance.jstree(true).edit(selNode);
    };

    vm.delete = function() {
        var selNode = vm.treeInstance.jstree(true).get_selected();
        if(!selNode.length) { return false; }
        vm.treeInstance.jstree(true).delete_node(selNode);
    };

    vm.save = function(){

    }





    vm.cancel = function(){
        datasetService.clearCriteria();
        $state.go('export.datasets',{studyId:projectId})
    }
    vm.prev = function(){
        //datasetService.clearCriteria();
        $state.go('export.wizard.filters',{studyId:projectId})
    }
    vm.next = function(){
        //datasetService.clearCriteria();
        $state.go('export.wizard.info',{studyId:projectId})
    }






}

angular.module('bioSpeak.export')
    .controller('stepThreeTreeController',['$scope','$state','$stateParams','$timeout','datasetService', stepThreeTreeController]);