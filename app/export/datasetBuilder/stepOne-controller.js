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
            state : { key : "step1", ttl: 1800000},
            checkbox:{
                three_state:true//,
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
            plugins : ['checkbox','changed','state']
        };
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
                var field = data.instance.get_node(data.selected[i]).original.field;
                field.isSelected = true
                vm.selFields.push(field);
            }
            $scope.$apply();

            console.log('selectChanged',vm.selFields);
        }

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
