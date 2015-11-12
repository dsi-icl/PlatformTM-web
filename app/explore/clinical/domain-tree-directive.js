/**
 * Created by iemam on 15/01/2015.
 */
angular.module('biospeak.clinical')

    .directive('clTree',function(){
        return{
            restrict:'E',
            scope:{
                observations:'=',
                getChartingOpts:'&',
                getObsIdsForMeddra: '&'
            },
            template:
                '<div class="clinicalTree row ">'+
                    /*'<div class="col-md-12">'+
                        '<button class="btn btn-sm btn-block">'+
                            '<span>Clinical Observations</span>'+
                        '</button>'+
                    '</div>'+*/
                    '<cl-tree-class ng-repeat="class in observations" ' +
                        'class="class" get-obs-ids-for-meddra="getObsIdsForMeddra({ medraterm: medraterm })" ></cl-tree-class>'+
                '</div>',
            link: function(scope, element, attrs){
            }
        }
    })

    .directive('clTreeClass', function(){
        return{
            restrict:'EA',
            template:
                '<div class="col-md-6">'+
                    //'<div class="connecting-line"></div>'+
                    '<div class="ibox">'+
                        '<div class="ibox-title">'+
                            //'<button type="button" class="btn btn-sm btn-block" style="background-color: #00afbc;border-radius:30px">{{class.class}}</button>'+
                            '<h3>{{class.class}}</h3>'+
                        '</div>'+
                    //'<div class="connecting-line"></div>'+
                    '<div class="ibox-content">'+
                        '<cl-tree-obs-grp ng-repeat="domain in class.domains" ' +
                            'group="domain"  ' +
                            'get-obs-ids-for-meddra="getObsIdsForMeddra({ medraterm: medraterm })"'+
                            'get-charting-opts="getChartingOpts()">' +
                        '</cl-tree-obs-grp>'+
                    '</div>'+
                '</div>'
        }
    })

    .directive('clTreeObsGrp', function(){
        return{
            restrict:'EA',
            scope:{
                group:'=',
                getChartingOpts:'&',
                getObsIdsForMeddra: '&'
            },
            controller: function($scope) {
             // $scope is the appropriate scope for the directive
             //console.log('inside cltreeobsgrouo controller ',$scope)
             },
            template:
                '<div class="btn-group btn-block" style="margin-top: 3px;">'+
                    '<button class="col-md-1 btn btn-sm node-toggle" data-toggle="collapse" href="#{{group.code}}">'+
                        '<span class="caret"></span>'+
                    '</button>'+
                    '<button class="tree-node col-md-11 btn btn-sm tree-node" ' +
                        'id="grp_{{group.code}}"'+
                        'val="{{group.groupTerm}}"'+
                        'obsid = "{{group.termIds}}"'+
                        'grp="{{chartGroup}}"'+
                        'charting-button ' +
                        'active="{{isActive}}"'+
                        'ng-init="isActive = false"'+
                        'ng-click="isActive = !isActive"' +
                        'chart-service="{{chartService}}"'+
                        'xfilter-service="{{xfilterService}}"'+
                        'project-id="{{projectId}}"'+
                        'container="{{chartContainerId}}">'+
                        '<span>{{group.name}}</span>'+' <span>({{group.count}})</span>'+
                    '</button>'+
                '</div>'+
                '<div id="{{group.code}}"  class="collapse col-md-offset-1">'+
                    '<cl-tree-obs ng-repeat="obs in group.terms" <!--observation="obs" plot-obs="plotObs({obs:obs})"-->></cl-tree-obs>'+
                '</div>',
            link: function (scope, element, attrs) {


                    //console.log(scope.getChartingOpts())
                    scope.chartContainerId = scope.getChartingOpts().container;
                    scope.chartService = scope.getChartingOpts().DCchartService;
                    scope.chartGroup = scope.getChartingOpts().chartGroup;
                    scope.xfilterService = scope.getChartingOpts().xfilterService;
                    scope.projectId = scope.getChartingOpts().projectId;
                //var medraterm =scope.group.code;
                //console.log('scope inside link function of cltreeobsgrp',scope.group.groupTerm)
                    //scope.ids = scope.getObsIdsForMeddra({ medraterm: medraterm })

            }
        }
    })

    .directive('clTreeObs',function($compile){
        return{
            restrict:'EA',
            /*scope:{
              observation:'=',
              plotObs:'&'
            },*/
            template:
                '<button id="obs_{{obs.code}}" ' +
                    'class="btn btn-sm tree-leaf"  '+
                    'charting-button ' +
                    'val="{{obs.code}}" ' +
                    'obsid="{{obs.id}}" ' +
                    'domain="{{obs.domainCode}}"'+
                    'obsrv="{{obs.code}}"'+
                    'active="{{isActive}}"'+
                    'container="{{chartContainerId}}"'+
                    'grp="{{chartGroup}}"' +
                    'chart-service="{{chartService}}"' +
                    'xfilter-service="{{xfilterService}}"'+
                    'project-id="{{projectId}}"'+
                    //'ng-class="{'': !isActive, 'active': isActive}"
                    'ng-init="isActive = false"'+
                    'ng-click="isActive = !isActive">' +
                    '<span>{{obs.name}}</span>'+
                '</button>',
            link: function (scope, element, attrs) {

                if (angular.isArray(scope.obs.terms)) {
                    $compile("<cl-tree-obs-grp group='obs' " +
                             'get-obs-ids-for-meddra="getObsIdsForMeddra({ medraterm: medraterm })"'+
                             "get-charting-opts='getChartingOpts()'></cl-tree-obs-grp>")(scope, function(cloned, scope){
                        element.replaceWith(cloned);
                    });
                }else{
                    //console.log(scope.getChartingOpts())
                    scope.chartContainerId = scope.getChartingOpts().container
                    scope.chartService = scope.getChartingOpts().DCchartService
                    scope.chartGroup = scope.getChartingOpts().chartGroup
                    scope.xfilterService = scope.getChartingOpts().xfilterService
                    scope.projectId = scope.getChartingOpts().projectId;
                }
            }
        }
    })


