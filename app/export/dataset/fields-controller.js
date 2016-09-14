/**
 * Created by iemam on 06/10/2015.
 */



'use strict';

function stepOneController($scope, $state, $stateParams, $timeout, exportService) {

    var vm = this;
    vm.dataLoaded = false;
    vm.showComputed = false;

    vm.computeFunctions = [
        {name: 'AVERAGE', type: 'Aggregation'},
        {name: 'SUM', type: 'Aggregation'},
        {name: 'MAX', type: 'Aggregation'},
        {name: 'MIN', type: 'Aggregation'},
        {name: 'ADD', type: 'Operators'},
        {name: 'SUBTRACT', type: 'Operators'},
        {name: 'MULTIPLY', type: 'Operators'},
        {name: 'DIVIDE', type: 'Operators'},
        {
            name: 'CASE', type: 'Transform',
            template: [{name: 'CASE', type: 'function'},
                {name: '', type: 'field'},
                {name: 'WHEN', type: 'function'},
                {name: '', type: 'param'},
                {name: 'THEN', type: 'function'},
                {name: '', type: 'param'},
                {name: 'END', type: 'function'}]
        },
        {
            name: 'CASE (WHEN)', type: 'Transform',
            template: [
                {name: 'WHEN', type: 'function'},
                {name: '', type: 'param'},
                {name: 'THEN', type: 'function'},
                {name: '', type: 'param'}]
        }


    ]

    //console.log(vm.dataLoaded);

    var projectId = $stateParams.studyId
    var datasetId = $stateParams.datasetId

    // vm.selFields = $scope.$parent.parentCtrl.DS.fields;

   /* $scope.$watch('$scope.$parent.parentCtrl.DS.fields', function(fields) {
        vm.selFields = fields;
    });*/

    // console.log(vm.selFields)
   /* $scope.$on('overlaychange', function(event, args,val){
        console.log("change detected",event,args,val)
        //any other action can be perfomed here
    });*/

    //console.log($scope.$parent.parentCtrl.fields.dataLoaded)

    //if(!$scope.$parent.parentCtrl.fields.dataLoaded){

    exportService.fetchDataset(datasetId,projectId).then(function(ds){
        console.log("Back and setting vm.selFields to ", ds.fields)
        vm.selFields = ds.fields;
        
    })

    exportService.getDataFields(projectId).then(function (data) {
        /*vm.treeConfig = {
            core: {
                multiple: true,
                animation: true,
                error: function (error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                themes: {
                    dots: false,
                    icons: false,
                    stripes: true
                },
                check_callback: false,
                worker: true
            },
            defaults: {},
            checkbox: {
                three_state: true//,
                //visible:false
            },
            state: {key: "step1", ttl: 900000},
            types: {
                default: {
                    icon: 'glyphicon glyphicon-flash'
                },
                star: {
                    icon: 'glyphicon glyphicon-star'
                },
                cloud: {
                    icon: 'glyphicon glyphicon-cloud'
                }
            },
            version: 1,
            plugins: ['checkbox', 'changed', 'state', 'search', 'dnd']
        };*/

        vm.treeData = data.fields;

        vm.dataLoaded = true

        /*vm.treeConfig.version++;*/

    })
    // }


    


    // vm.selFields = $scope.$parent.parentCtrl.DS.fields;
/*    $scope.$watch('$parent.parentCtrl.dsRetrieved', function(dataLoaded) {
        if (dataLoaded) {
            vm.selFields = $scope.$parent.parentCtrl.DS.fields;
        }
    });*/


    vm.toggleNode = function(node){
        console.log("I made it",node)
        if(node.selected){
            vm.selFields.push(node.field);
        }else{
            var pos;
            for(var i=0; i< vm.selFields.length;i++) {
                if(node.field.fieldName == vm.selFields[i].fieldName){
                    pos = i;
                    break;
                }
            }
            vm.selFields.splice(pos,1);
        }
        //$scope.$apply();
    }

    vm.treeChanged = function (event, data) {

        var i, j;
        $scope.$parent.parentCtrl.DS.fields = [];
        for (i = 0, j = data.selected.length; i < j; i++) {
            var field = data.instance.get_node(data.selected[i]).original.field;
            field.isSelected = true;
            $scope.$parent.parentCtrl.DS.fields.push(field);
        }
        $scope.$apply();
    };


    vm.clearFields = function () {
        $scope.$parent.parentCtrl.DS.fields = [];
        $scope.$apply();
        //$scope.$parent.parentCtrl.treeInstance.jstree(true).deselect_all();
        vm.treeInstance.jstree(true).deselect_all();
    };



    vm.next = function () {

        //$scope.$parent.parentCtrl.DS.fields = vm.selFields;

        console.log($scope.$parent.parentCtrl.DS);

        exportService.updateLocalDS($scope.$parent.parentCtrl.DS).then(function () {
            $state.go('export.wizard.filters', {
                datasetId: datasetId,
                projectId: projectId
            });
        });


        // var criteria = [];
        // var filters = {}
        //
        //
        // /**
        //  * *******************Create a list of Criterion for each distinct O3
        //  */
        //
        // angular.forEach(vm.selFields,function(obj){
        //     var criterion
        //     if(filters[obj.o3Id]){
        //         criterion = filters[obj.o3Id]
        //     }
        //     else{
        //         criterion = {}
        //         criterion.o3 = obj.o3Id
        //         criterion.exactFilters = [];
        //         criterion.rangeFilters = [];
        //         criterion.projection = [];
        //         criterion.exactFilters.push({"field": obj.o3VarName, "values":[obj.o3Name]})
        //         criterion.exactFilters.push({"field": "DOMAIN", "values":[obj.domainCode]})
        //         if(obj.groupName)
        //             criterion.exactFilters.push({"field": obj.groupVarName, "values":[obj.groupName]})
        //
        //         filters[obj.o3Id] = criterion
        //         criteria.push(criterion)
        //     }
        //
        //
        //     if(criterion.projection.indexOf(obj.o3Name+'_'+obj.qO2Name) == -1)
        //         criterion.projection.push(obj.o3Name+'_'+obj.qO2Name)
        //
        // })
        // console.log(criteria);
        //
        // /**
        //  * *************************************************
        //  */
        //
        //
        // //datasetService.saveFields(vm.selFields);
        //
        // var user = "lepianiste@gmail.com"
        // datasetService.saveCriteria(user,criteria)
        //     .then(function(){
        //         $state.go('export.wizard.filters',{
        //             datasetId: 0,
        //             projectId: 'P-BVS'
        //         });
        // })

    }
    vm.cancel = function () {
        //datasetService.clearCriteria();
        $state.go('export.datasets', {studyId: projectId})
    }

    /*JSTREE FUNCTIONS*/
    vm.createTreeNode = function (event, data, x) {
        console.log(event, data, x)
        //angular.element("fields_tree").off("click.jstree", ".jstree-anchor");
        //vm.treeInstance.jstree(true).unbind("click.jstree", ".jstree-anchor");
    }
    vm.reCreateTree = function () {
        vm.treeConfig.version++;
    }
    vm.refreshTree = function () {
        vm.treeInstance.jstree(true).clear_state();
        vm.treeInstance.jstree(true).refresh(true, true);

    }
    vm.applySearch = function () {
        console.log('here')
        var to = false;
        if (to) {
            clearTimeout(to);
        }
        to = $timeout(function () {
            if ($scope.$parent.parentCtrl.treeInstance) {
                $scope.$parent.parentCtrl.treeInstance.jstree(true).search(vm.treeSearchTerm, true, true);
            }
        }, 1000);
    };

    /*COMPUTED FIELD FUNCTIONS*/
    vm.addComputedField = function () {
        vm.showComputed = true;
        vm.cField = {};

    }
    vm.addFunc = function (func) {
        vm.showExpressionDiv = true
        if (!vm.cField) vm.cField = {}

        if (func.name == 'CASE (WHEN)') {
            var currExpression = vm.cField.expressionList
            console.log(currExpression)
            if (currExpression[0].name == 'CASE') {
                var pos = currExpression.indexOf("END");
                //vm.cField.expressionList.splice(pos, 0, func.template)
                console.log(vm.cField.expressionList)
                vm.cField.expressionList.splice.apply(currExpression, [pos, 0].concat(func.template))
                console.log(vm.cField.expressionList)
                //     vm.cField.expressionList = [currExpression.slice(0, pos), func.template, currExpression.slice(pos)].join('');
            }

        }
        else
            vm.cField.expressionList = func.template;

    }
    vm.funcSelected = function (func) {
        console.log(func, 'HERE')
        vm.function = func;
    }
    vm.insertFunction = function (func) {
        //get from server the expression for this function
        //and then parse the expression and then push to html of the expression div
    }
    vm.startCallback = function (event, ui, title) {
        console.log('You started draggin: ' + title);
        vm.draggedTitle = title;
    };
    vm.stopCallback = function (event, ui) {
        console.log('Why did you stop draggin me?');
    };
    vm.dragCallback = function (event, ui) {
        console.log('hey, look I`m flying');
    };
    vm.dropCallback = function (event, ui, variable, index) {
        console.log('Before dropCallback', variable)
        //variable.mapToStringValueList[index] = null;//$scope.draggedTitle
        console.log('After dropCallback', variable)
        //console.log('hey, you dumped me :-(' , $scope.draggedTitle);

    };
    vm.overCallback = function (event, ui) {
        console.log('Look, I`m over you');
    };
    vm.outCallback = function (event, ui) {
        console.log('I`m not, hehe');
    };
    vm.remFromExpression = function (e) {
        e.field = null
    }

}

angular.module('bioSpeak.export')
    .controller('stepOneController', ['$scope', '$state', '$stateParams', '$timeout', 'exportService', stepOneController]);


