/**
 * Created by iemam on 15/01/2015.
 */
angular.module('biospeak.explorer')

    .directive('clinicalObsBrowser',function(){
        return{
            restrict:'EA',
            scope:true,
            controller: function($scope){
              //console.log("obs browser",$scope)
            },
            template:
            '<div class="clinical-tree ">'+
                '<cl-tree-class ng-repeat="class in clinicalObservations" class="class" ></cl-tree-class>'+
            '</div>',
            link: function(scope, element, attrs){
                console.log(scope)
            }
        }
    })

    .directive('clTreeClass', function(){
        return{
            restrict:'EA',
            scope:true,
            controller: function($scope){
                //console.log("obs class",$scope.chartingOpts)
            },
            template:
            '<div class="">'+
                '<div class="">'+
                    '<div class="ibox-content">'+
                        '<h3>{{class.class}}</h3>'+

          /*  '<div class="input-group"><input type="text" placeholder="Search" class="input-sm form-control"> <span class="input-group-btn">'+
           ' <button type="button" class="btn btn-sm btn-primary"> Go!</button> </span></div>'+*/

                        '<ul class="list-group ">'+
                            '<cl-tree-obs-grp ng-repeat="domain in class.domains" ' +
                                'group="domain"  ' +
                                'charting-opts = "chartingOpts"'+
                                //'get-obs-ids-for-meddra="getObsIdsForMeddra({ medraterm: medraterm })"'+
                                /*'get-charting-opts="getChartingOpts()"*/'>' +
                            '</cl-tree-obs-grp>'+
                        '</ul>'+
                    '</div>'+
                '</div>'+
            '</div>'
        }
    })

    .directive('clTreeObsGrp', function(){
        return{
            restrict:'EA',
            scope:{
                group:'=',
                chartingOpts:'='
            },

            //scope:true,
            controller: function($scope) {
                //console.log("obs group",$scope.group)
            },
            replace:true,
            template:
            '<li class="list-group-node">'+
                '<div class="btn-group btn-block">'+
                    '<button style="outline:none;" class="btn btn-sm node-toggle" data-toggle="collapse" href="#{{group.code}}">'+
                    '<span class="caret"></span>'+
                    '</button>'+
           /* ' <input  icheck type="checkbox"  ng-model="var.isSelected" >'+*/
                    '<div class="list-group-item-text col-md-12" ' + 'id="grp_{{group.code}}"'+ '>'+
                        /*'<div class="pull-left" ng-if="group.isSelectable"> ' +
                            //'<input  icheck type="checkbox"  ng-model="var.isSelected" >' +
                            '<a  charting-button id="obsgrp_{{group.id}}" ' +
                            'obs="group.observationGroup"  charting-opts="chartingOpts" style="color: #222f3f;" ' +
                            'ng-init="group.observationGroup.isActive = false" ng-click="group.observationGroup.isActive = !group.observationGroup.isActive"> ' +
                            '<i style="color:#23c6c8" class="fa fa-toggle-off fa-2x p-xs" ></i> ' +
                            '</a>'+
                            '<cl-option-menu obs="group.observationGroup" charting-opts="chartingOpts"  class="pull-right"></cl-option-menu>'+
                        '</div>'+*/
                        '<div><span>{{group.name}}</span><span> ({{group.count}}) </span></div>'+//+
                    '</div>'+
                '</div>'+
                '<ul id="{{group.code}}"  class="list-group collapse">'+
                    '<li cl-tree-obs class="list-group-item" ng-repeat="obs in group.terms"' + 'obs="obs"  ' + 'charting-opts="chartingOpts">'+
                        //'get-obs-ids-for-meddra="getObsIdsForMeddra({ medraterm: medraterm })"'+
                    '</li>'+
                '</ul>'+
            '</li>',
            link: function (scope, element, attrs) {

            }
        }
    })

    .directive('clTreeObs',function($compile){
        return{
            restrict:'EA',

            /*scope:{
               // group:'=',
               // getChartingOpts:'&',
               // getObsIdsForMeddra: '&',
                chartingOpts:'=',
                obs:'='
            },*/
            scope:true,
            template:
            '<div>' +
                '<a  charting-button id="obs_{{obs.id}}" ' +
                    'obs="obs.defaultObservation" quals="obs.qualifiers" charting-opts="chartingOpts" style="color: #222f3f;" ' +
                    'ng-init="obs.defaultObservation.isActive = false" ng-click="obs.defaultObservation.isActive = !obs.defaultObservation.isActive"> ' +
                    '<i style="color:#23c6c8" class="fa fa-toggle-off fa-2x p-xs" ></i> <span>{{obs.defaultObservation.o3}}</span>' +
                '</a>'+

                '<cl-option-menu obs="obs" charting-opts="chartingOpts"  class="pull-right"></cl-option-menu>'+
            '</div>',

            link: function (scope, element, attrs) {
                //console.log('clTreeObs scope',scope.chartingOpts)

                if (angular.isArray(scope.obs.terms)) {
                    $compile("<cl-tree-obs-grp group='obs' " +
                    //'get-obs-ids-for-meddra="getObsIdsForMeddra({ medraterm: medraterm })"'+
                    "charting-opts='chartingOpts'></cl-tree-obs-grp>")(scope, function(cloned, scope){
                        element.replaceWith(cloned);
                    });
                }
            }
        }
    })

    .directive('clOptionMenu', function() {
        return {
            restrict: 'EA',
            scope: {
                obs: '=',
                chartingOpts: '='
            },
            scope:true,
            controller: function ($scope, $element) {
                //console.log('menu scope',$scope.obs)
            },
            template:
            '<div style="top: 10px;margin-right: 25px;" class="dropdown slider-control" uib-dropdown>'+
                '<a class="dropdown-toggle" href uib-dropdown-toggle>'+
                    '<i class="fa fa-ellipsis-v"></i>'+
                '</a>'+
                '<ul class=" dropdown-menu dropdown-menu-right plotting-options"> ' +
                    '<li class="dropdown-header">Chart Value for {{obs.o3}}</li>'+
                    /*'<li ng-repeat="q in obs.qualifiers">' +
                        '<div class="checkbox">' +
                            '<input id="checkbox1" dc-chart-slider-control qualifier={{q}} type="checkbox" checked>' +
                            '<label for="checkbox1">Original Results</label>' +
                        '</div>' +
                    '</li>' +*/
                    '<li>' +
                        '<div ng-repeat="var in obs.qualifiers" class="checkbox">'+
                            '<input id="checkbox_{{var.id}}" type="checkbox" ' +
                                    'charting-button  obs="var"  ' +
                                    'ng-init="var.isActive = false" ng-click="var.isActive = !var.isActive" ' +
                                    'charting-opts="chartingOpts" >' +
                            '<label for="checkbox_{{var.id}}">{{var.qO2}}{{var.o3id}}</label>' +
                        '</div>' +
                    '</li> ' +
                    '<li role="separator" class="divider"></li>'+
                    '<li><a href><i class="fa fa-arrow-circle-o-down"></i>&nbsp; Add to cart</a></li>'+
                '</ul>'+
            '</div>'
        }
    })


