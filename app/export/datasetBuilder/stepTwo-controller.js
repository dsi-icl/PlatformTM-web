/**
 * Created by iemam on 06/10/2015.
 */

'use strict';
function stepTwoController($scope,$state,$stateParams,datasetService){

    var vm = this;
    vm.dataLoaded = false;
    var projectId = $stateParams.studyId;


    datasetService.getDataFields(projectId).then(function(data){
        vm.treeData = data.fields;
        vm.dataLoaded = true
        vm.treeConfig.version++;
    })

    vm.filters = []
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
        state : { key : "step1" },
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
        plugins : ['checkbox','changed','state']
    };

    vm.treeChanged = function (event,data){
        //var i, j;
        //vm.filters = []
        //for(i = 0, j = data.selected.length; i < j; i++) {
        //    vm.filters.push(data.instance.get_node(data.selected[i]).original.field);
        //}
        //$scope.$apply();
        //
        ////vm.selFields = _selFields;
        //console.log('selectChanged',vm.selFields);
    }
    vm.nodeSelected = function (event,data) {
        //console.log(data.node)
        var field = data.node.original.field;
        //console.log(field)
        datasetService.getFieldFilter(projectId,field).then(function(data){
            console.log(data)
            var field = data.field;
            //console.log(filter);
            //console.log(filter.valueSet.isNumeric);
            field.update = function(slider){
                field.filter.from = slider.fromNumber;
                field.filter.to = slider.toNumber;
                $scope.$apply();
            }

            if(field.filter.isNumeric)
                field.ionSliderOptions = {
                    min: field.filter.min,
                    max: field.filter.max,
                    from: field.filter.from,
                    to: field.filter.to,
                    type: 'double',
                    postfix: ' '+field.filter.unit,
                    maxPostfix: "+",
                    prettify: false,
                    hasGrid: true,
                    onChange: field.update
                }
            vm.filters.push(field);
        })
        console.log(vm.filters)
    };
    vm.nodeDeselected = function (node,selected,event) {
        //console.log('node deselected',node,selected,event);
    };

    vm.next = function(){
        datasetService.getCriteria().then(function(criteria){
            console.log(criteria)

            angular.forEach(vm.filters,function(filter){
                console.log(filter)
                var criterion=null;
                angular.forEach(criteria,function(c){
                    console.log(c)
                    if(c.o3 == filter.o3Id)
                    criterion = c
                })

                if(!criterion){
                    console.log("field not added in the previous step")
                    criterion = {}
                    criterion.o3 = filter.o3Id
                    criterion.exactFilters = [];
                    criterion.rangeFilters = [];
                    criterion.projection = [];
                    criterion.exactFilters.push({"field": filter.o3VarName, "values":[filter.o3Name]})
                    criterion.exactFilters.push({"field": "DOMAIN", "values":[filter.domainCode]})
                    if(filter.groupName)
                        criterion.exactFilters.push({"field": filter.groupVarName, "values":[filter.groupName]})
                    criteria.push(criterion);
                }

                if(filter.valueSet.isNumeric){
                    var nRange = {}
                    nRange.field = filter.qO2Name;
                    nRange.range = {};
                    nRange.range.upperBound = filter.valueSet.to;
                    nRange.range.lowerBound = filter.valueSet.from;
                    criterion.rangeFilters.push(nRange);
                }
                else{
                    criterion.exactFilters.push({"field": filter.qO2Name, "values":filter.valueSet.filterValues})
                }

            })

            console.log(criteria)

            datasetService.saveCriteria('ibrahim',criteria);
            $state.go('export.wizard.preview.table',{studyId:projectId})
        })

    }
    vm.cancel = function(){
        datasetService.clearCriteria();
        $state.go('export.datasets',{studyId:projectId})
    }
    vm.prev = function(){
        //datasetService.clearCriteria();
        $state.go('export.wizard.fields',{studyId:projectId})
    }
}


angular.module('bioSpeak.export')
    .controller('stepTwoController',['$scope','$state','$stateParams','datasetService',stepTwoController])


