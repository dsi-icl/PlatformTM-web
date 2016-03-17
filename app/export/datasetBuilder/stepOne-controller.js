/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepOneController($scope,$state,$stateParams,$timeout,datasetService){

        var vm = this;
        vm.dataLoaded = false;
        console.log(vm.dataLoaded);

        var projectId = $stateParams.studyId
        datasetService.getDataFields(projectId).then(function(data){
            vm.treeData = data.fields;
            vm.dataLoaded = true
            vm.treeConfig.version++;
        })


        //vm.treeData =   [
        //    { id : 'ajson1', parent : '#', text : 'Simple root node', state: { opened: true} },
        //    { id : 'ajson2', parent : '#', text : 'Root node 2', state: { opened: true} },
        //    { id : 'ajson3', parent : 'ajson2', text : 'Child 1', state: { opened: true} },
        //    { id : 'ajson4', parent : 'ajson2', text : 'Child 2' , state: { opened: true}}
        //]

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
                three_state:false//,
                //visible:false
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


        //datasetService.getCriteria().then(function(c){
        //    vm.selFields = c;
        //})

        vm.selFields = [];


        //$scope.selFields = _selFields
/*        $scope.$watch('fldCtrl.selFields',function (newval) {
            console.log("INSIDE WATCH",newval)
            vm.fields = newval//$scope.selFields;


        },true)*/

        vm.nodeSelected = function (node) {
            console.log('node selected',node);
        };

        vm.nodeDeselected = function (node,selected,event) {
            //console.log('node deselected',node,selected,event);
        };

        vm.treeChanged = function (event,data){

            var i, j;
            vm.selFields = []
            for(i = 0, j = data.selected.length; i < j; i++) {
                vm.selFields.push(data.instance.get_node(data.selected[i]).original.field);
            }
            $scope.$apply();

            //vm.selFields = _selFields;
            console.log('selectChanged',vm.selFields);
        }

        //$('#html1').jstree(vm.treeConfig);

        //vm.categories = [
        //    {
        //        title: 'Computers',
        //        id:'1',
        //        categories: [
        //            {
        //                title: 'Laptops',
        //                id:'1.1',
        //                categories: [
        //                    {
        //                        id:'1.1.1',
        //                        title: 'Ultrabooks'
        //                    },
        //                    {
        //                        id:'1.1.2',
        //                        title: 'Macbooks'
        //                    }
        //                ]
        //            },
        //
        //            {
        //                id:'1.2',
        //                title: 'Desktops'
        //            },
        //
        //            {
        //                title: 'Tablets',
        //                id:'1.3',
        //                categories: [
        //                    {
        //                       id:'1.3.1',
        //                        title: 'Apple'
        //                    },
        //                    {
        //                        id:'1.3.2',
        //                        title: 'Android'
        //                    }
        //                ]
        //            }
        //        ]
        //    },
        //
        //    {
        //        id:'2',
        //        title: 'Printers'
        //    }
        //
        //];
        //
        //
        //$timeout(function(){
        //
        //    $('#html2').on('changed.jstree',function(event,data){
        //            var i, j;
        //            vm.selFields = []
        //            for(i = 0, j = data.selected.length; i < j; i++) {
        //
        //                var fn = data.instance.get_node(data.selected[i])//.a_attr.field
        //                console.log(fn)
        //                //vm.nodeSelected(fn)
        //
        //
        //                vm.selFields.push(data.instance.get_node(data.selected[i]));
        //            }
        //            $scope.$apply();
        //            //vm.selFields = _selFields;
        //            console.log('selectChanged',vm.selFields);
        //        }).jstree(vm.treeConfig);
        //},1000)




        vm.next = function(){

            var criteria = [];
            var filters = {}


            /**
             * *******************Create a list of Criterion for each distinct O3
             */

            angular.forEach(vm.selFields,function(obj){
                var criterion
                if(filters[obj.o3Id]){
                    criterion = filters[obj.o3Id]
                }
                else{
                    criterion = {}
                    criterion.o3 = obj.o3Id
                    criterion.exactFilters = [];
                    criterion.rangeFilters = [];
                    criterion.projection = [];
                    criterion.exactFilters.push({"field": obj.o3VarName, "values":[obj.o3Name]})
                    criterion.exactFilters.push({"field": "DOMAIN", "values":[obj.domainCode]})
                    if(obj.groupName)
                        criterion.exactFilters.push({"field": obj.groupVarName, "values":[obj.groupName]})

                    filters[obj.o3Id] = criterion
                    criteria.push(criterion)
                }


                if(criterion.projection.indexOf(obj.o3Name+'_'+obj.qO2Name) == -1)
                    criterion.projection.push(obj.o3Name+'_'+obj.qO2Name)

                //THERE ARE NO ,ultiple values at this stage per variable, if a variable is added
                //twice that means that each was added to a different O3
                //if(!filters[obj.o3VarName])
                //    filters[obj.o3VarName] = []
                //filters[obj.o3VarName].push(obj.o3Name)

                //console.log(criterion);
            })
            //angular.forEach(filters,function(v,k,obj){
            //    console.log(v,k,obj)
            //    criterion = {}
            //    criterion.o3 = k
            //    criterion.exactFilters = [];
            //    criterion.exactFilters.push({"field": k, "values":v})
            //})
            console.log(criteria);

            /**
             * *************************************************
             */


            //datasetService.saveFields(vm.selFields);

            var user = "lepianiste@gmail.com"
            datasetService.saveCriteria(user,criteria)
                .then(function(){
                    $state.go('export.wizard.filters',{
                        datasetId: 0,
                        projectId: 'P-BVS'
                    });
            })

        }

        vm.cancel = function(){
            datasetService.clearCriteria();
            $state.go('export.datasets',{studyId:projectId})
        }



    }

    angular.module('bioSpeak.export')
        .controller('stepOneController',['$scope','$state','$stateParams','$timeout','datasetService',stepOneController]);
