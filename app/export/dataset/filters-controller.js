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
            };

            vm.treeData = data.fields;


            vm.dataLoaded = true;

            vm.treeConfig.version++;

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
    var filters = $scope.parentCtrl.DS.filters;
    for(var i=0; i<filters.length; i++){
        vm.filters.push(prepareFilterControl(filters[i]))
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
        
        // angular.forEach(vm.filters,function(filter){
        //             console.log(filter)
        //
        //             if(filter.isNumeric){
        //                 var nRange = {}
        //                 nRange.field = filter.qO2Name;
        //                 nRange.range = {};
        //                 nRange.range.upperBound = filter.valueSet.to;
        //                 nRange.range.lowerBound = filter.valueSet.from;
        //                 criterion.rangeFilters.push(nRange);
        //             }
        //             else{
        //                 criterion.exactFilters.push({"field": filter.qO2Name, "values":filter.valueSet.filterValues})
        //             }
        //
        //         })

        //update parentDS filters with vm.filters
        // datasetService.getCriteria().then(function(criteria){
        //     console.log(criteria)
        //
        //     angular.forEach(vm.filters,function(filter){
        //         console.log(filter)
        //         var criterion=null;
        //         angular.forEach(criteria,function(c){
        //             console.log(c)
        //             if(c.o3 == filter.o3Id)
        //             criterion = c
        //         })
        //
        //         if(!criterion){
        //             console.log("field not added in the previous step")
        //             criterion = {}
        //             criterion.o3 = filter.o3Id
        //             criterion.exactFilters = [];
        //             criterion.rangeFilters = [];
        //             criterion.projection = [];
        //             criterion.exactFilters.push({"field": filter.o3VarName, "values":[filter.o3Name]})
        //             criterion.exactFilters.push({"field": "DOMAIN", "values":[filter.domainCode]})
        //             if(filter.groupName)
        //                 criterion.exactFilters.push({"field": filter.groupVarName, "values":[filter.groupName]})
        //             criteria.push(criterion);
        //         }
        //
        //         if(filter.valueSet.isNumeric){
        //             var nRange = {}
        //             nRange.field = filter.qO2Name;
        //             nRange.range = {};
        //             nRange.range.upperBound = filter.valueSet.to;
        //             nRange.range.lowerBound = filter.valueSet.from;
        //             criterion.rangeFilters.push(nRange);
        //         }
        //         else{
        //             criterion.exactFilters.push({"field": filter.qO2Name, "values":filter.valueSet.filterValues})
        //         }
        //
        //     })
        //
        //     console.log(criteria)
        //
        //     datasetService.saveCriteria('ibrahim',criteria);
        //     $state.go('export.wizard.preview.table',{studyId:projectId})
        // })

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
        console.log('updating',$scope.$parent.parentCtrl.DS.fields);
        angular.forEach($scope.$parent.parentCtrl.DS.fields,function(field){
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


