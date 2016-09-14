/**
 * Created by iemam on 06/10/2015.
 */

'use strict';
function stepTwoController($scope,$state,$stateParams,exportService){

    var vm = this;
    //vm.dataLoaded = false;
    var projectId = $stateParams.studyId;
    var datasetId = $stateParams.datasetId;

    //$scope.$parent.parentCtrl.filters.treeConfig.version++;

    // if($scope.$parent.parentCtrl.dataLoaded)
    //     $scope.$parent.parentCtrl.filters.treeInstance.jstree(true).refresh(true,true);

    // console.log($scope.$parent.parentCtrl.filters.dataLoaded)
    // vm.dataLoaded = $scope.$parent.parentCtrl.filters.dataLoaded
    // if(!$scope.$parent.parentCtrl.filters.dataLoaded){
    //
        exportService.getDataFields(projectId).then(function(data){
          /*  vm.treeConfig = {
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
                defaults: {},
                checkbox:{
                    three_state:true//,
                    //visible:false
                },
                state : { key : "step2" },
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
                plugins : ['checkbox','changed','state','search']
            };*/

            vm.treeData = data.fields;


            vm.dataLoaded = true;

            // vm.treeConfig.version++;

        })
    // }


    var prepareFilterControl = function(filter){

        filter.update = function(slider){
            filter.from = slider.fromNumber;
            filter.to = slider.toNumber;
            filter.field.isFiltered = true;
            _updateField(filter.field);
            $scope.$apply();
        };

        if(filter.isNumeric)
            filter.ionSliderOptions = {
                min: filter.min,
                max: filter.max,
                from: filter.from,
                to: filter.to,
                type: 'double',
                postfix: ' '+filter.unit,
                maxPostfix: "+",
                prettify: false,
                hasGrid: true,
                onChange: filter.update
            };
        return filter
    };
    vm.filters = [];
    /*vm.filters = [];
    var filters = $scope.parentCtrl.DS.filters;
    for(var i=0; i<filters.length; i++){
        vm.filters.push(prepareFilterControl(filters[i]))
    }*/
    var currDS;
    exportService.fetchDataset(datasetId,projectId).then(function(ds){
        currDS = ds
        console.log("Back and setting filters to ", ds.filters)
        for(var i=0; i<ds.filters.length; i++){
            vm.filters.push(prepareFilterControl(filters[i]))
        }

    })

    vm.toggleNode = function(node){
        console.log("I made it",node)
        if(node.selected){
            exportService.getFieldFilter(projectId,node.field).then(function(data){
                //console.log(data)
                var filter = data.field;
                //console.log(filter);
                //console.log(filter.valueSet.isNumeric);
                // $scope.parentCtrl.DS.filters.push(filter);
                filter = prepareFilterControl(filter);
                vm.filters.push(filter);
            });
        }else{
            var pos;
            for(var i=0; i< vm.filters.length;i++) {
                if(node.field.fieldName == vm.filters[i].field.fieldName){
                    pos = i;
                    break;
                }
            }
            vm.filters.splice(pos,1);
        }
    }


    vm.nodeSelected = function (event,data) {

        var field = data.node.original.field;
        //console.log(field)
        var added = false;
        var i, j;
        for(i = 0, j = $scope.parentCtrl.DS.filters.length; i < j; i++) {
            if($scope.parentCtrl.DS.filters[i].field.displayName == field.displayName)
                added = true;
        }
        if(!added)
        exportService.getFieldFilter(projectId,field).then(function(data){
            //console.log(data)
            var filter = data.field;
            //console.log(filter);
            //console.log(filter.valueSet.isNumeric);
            $scope.parentCtrl.DS.filters.push(filter);
            filter = prepareFilterControl(filter);

            vm.filters.push(filter);
        });
        //console.log(vm.filters)
    };
    vm.nodeDeselected = function (node,selected,event) {
        //console.log('node deselected',node,selected,event);
    };
    vm.refreshTree = function(){
        vm.treeInstance.jstree(true).clear_state();
        vm.treeInstance.jstree(true).refresh(true,true);

    }
    vm.next = function(){

        exportService.updateLocalDS($scope.$parent.parentCtrl.DS).then(function(){
            $state.go('export.wizard.preview',{
                datasetId: datasetId,
                projectId: projectId
            });
        });
    };

    vm.cancel = function(){
        exportService.clearCriteria();
        $state.go('export.datasets',{studyId:projectId})
    };
    vm.prev = function(){
        //exportService.clearCriteria();
        $state.go('export.wizard.fields',{studyId:projectId,datasetId:datasetId})
    };

    var _updateField = function(filterField){
        console.log('updating',currDS.fields);
        angular.forEach(currDS.fields,function(field){
            console.log( field);
           if(field.fieldName == filterField.fieldName && field.property == filterField.property){
               console.log( "filterered true");
               field.isFiltered = true;
               $scope.$apply();
           }
        });
    }

}


angular.module('bioSpeak.export')
    .controller('stepTwoController',['$scope','$state','$stateParams','exportService',stepTwoController]);


