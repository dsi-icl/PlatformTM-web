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
                //console.log(scope)
            }
        }
    })

    .directive('clTreeClass', function(){
        return{
            restrict:'EA',
            scope:true,
            template:
                    '<div class="ibox-content">'+
                        '<h3>{{class.class}}</h3>'+
                        /*'<div class="input-group">' +
                            '<input type="text" placeholder="Search" class="input-sm form-control" ng-model="searchText"> ' +
                        '<span class="input-group-btn">'+
                            '<button type="button" class="btn btn-sm btn-primary"> Go!</button>' +
                        ' </span>' +
                        '</div>'+*/
                        '<ul>'+
                            '<cl-tree-obs-grp ng-repeat="domain in class.domains " group="domain" charting-opts = "chartingOpts" callbck = "getObsRequest(obs)"></cl-tree-obs-grp>'+
                        '</ul>'+
                    '</div>'
        }
    })

    .directive('clTreeObsGrp', function(){
        return{
            restrict:'EA',
            scope:{
                group:'=',
                chartingOpts:'='/*,
                search:'='*/,
                sels:'=',
                callbck: '&'
            },
            controller: function($scope,$injector) {
                $scope.vm = {}
                $scope.vm.selObs = []

                //if group.hasTerms and group.terms.length ==0
                //

                var clinicalDataService = $injector.get($scope.chartingOpts.clinicalDataService);

                var domain;



                $scope.localcallbck = function(request){
                    $scope.callbck({request:request})
                }

                if($scope.group.isDomain){
                    domain = $scope.group;
                    //$scope.group.selMultiObsGrps = [];
                    domain.selMultiObsGrps = {};
                    domain.selMultiObsGrps.currSelected = [];
                    domain.selMultiObsGrps.tempSelected = [];
                    domain.selMultiObsGrps.groupedObservations = [];

                    domain = $scope.group;
                    domain.selectedObservations = [];


                }else {
                    $scope.group.selMultiObsGrps = $scope.sels
                }

                $scope.groupObservations = function(){
                    var multiObsList = $scope.group.selMultiObsGrps;
                    var currSelected = multiObsList.currSelected;
                    var tempSelected = multiObsList.tempSelected;


                    var selectedObsRequests = [];

                    tempSelected.forEach(function(node){
                        selectedObsRequests.push(node.defaultObservation)
                        currSelected.push(node);
                    })

                    clinicalDataService.getGroupObsNode($scope.chartingOpts.projectId,selectedObsRequests)
                        .then(function(obsGrpNode){
                        var obsGroup = {};

                        obsGroup.observations = angular.copy(tempSelected);
                        obsGroup.obsRequest =  obsGrpNode.defaultObservation;
                        obsGroup.quals = obsGrpNode.qualifiers;
                        obsGroup.name = obsGrpNode.name;


                        for(var i=0; i< obsGroup.observations.length;i++) {
                            obsGroup.observations[i].isLocked = true;
                            obsGroup.observations[i].isSelected = false
                        }

                        console.log(obsGroup);
                        $scope.group.selMultiObsGrps.groupedObservations.push(obsGroup);


                        for(var i=0; i< currSelected.length;i++) {
                            currSelected[i].isGrouped = true
                        }
                        multiObsList.tempSelected = [];
                    })






                    //$scope.group.selMultiObsGrps.groupedObservations = currSelected;


                    //console.log($scope.group.selMultiObsGrps.groupedObservations);
                }

                $scope.checkChanged = function(checked){
                    var multiObsList = $scope.group.selMultiObsGrps;
                    var tempSelected = multiObsList.tempSelected;
                    var selectedObsGrp = $scope.group;
                    console.log("adding:",selectedObsGrp);

                    if(checked){
                        tempSelected.push(selectedObsGrp);
                    }
                    else{
                        var pos;
                        for(var i=0; i< tempSelected.length;i++) {
                            if(selectedObsGrp.code == tempSelected[i].code){
                                pos = i;
                                break;
                            }
                        }
                        tempSelected.splice(pos,1);
                    }
                }

                /*$scope.groupClicked = function(checked){
                    var obsGrp_list = $scope.group.selMultiObsGrps;
                    var selectedObsGrp = $scope.group;

                    console.log(selectedObsGrp);

                    //find the unlocked group in lockedGroups
                    var ObsGrp;
                    for(var k=0; k<obsGrp_list.length; k++){
                        if(!obsGrp_list[k].isLocked){
                            ObsGrp = obsGrp_list[k];
                            break;
                        }
                    }
                    // console.log('obsGroup is ', ObsGrp)
                    if(!ObsGrp){
                        // console.log('no unlocked gorups found')
                        var ObsGrp = {}
                        ObsGrp.name = selectedObsGrp.name;
                        ObsGrp.observations=[];

                        ObsGrp.selectedNodes = [];

                        ObsGrp.obsRequest = {};
                        ObsGrp.obsRequest.termIds = [];
                        ObsGrp.obsRequest.isMultipleObservations = true;
                        ObsGrp.obsRequest.isEvent = true;
                        ObsGrp.obsRequest.o3 = selectedObsGrp.name;
                        ObsGrp.quals = []

                        ObsGrp.isLocked = false;
                        obsGrp_list.push(ObsGrp);
                    }

                    if(checked){
                        //$scope.group.sels.groups.push($scope.group)
                        ObsGrp.observations.push(selectedObsGrp);

                        if(ObsGrp.observations.length > 1)
                            ObsGrp.name = ObsGrp.name.concat(", ",selectedObsGrp.name)

                    }
                    else{
                        var pos;
                        for(var i=0; i< ObsGrp.observations.length;i++) {
                            if(selectedObsGrp.code == ObsGrp.observations[i].code){
                                pos = i;
                                break;
                            }
                        }
                        ObsGrp.observations.splice(pos,1);
                    }

                    ObsGrp.obsRequest.termIds =[];
                    ObsGrp.obsRequest.o3id ="";

                        $scope.$apply(function(){
                        for(var i=0; i< ObsGrp.observations.length;i++) {
                            //console.log($scope.vm.sels[i].termNames)
                            for(var j=0; j< ObsGrp.observations[i].termNames.length;j++) {
                                $scope.vm.selObs.push(ObsGrp.observations[i].termNames[j])
                                //console.log($scope.vm.sels[i].termNames[j])
                            }

                            //console.log('obsgrp is',ObsGrp.observations[i].defaultObservation);
                            ObsGrp.obsRequest.termIds = ObsGrp.obsRequest.termIds.concat(ObsGrp.observations[i].defaultObservation.termIds);
                            ObsGrp.obsRequest.o3code = ObsGrp.observations[i].defaultObservation.o3code
                            ObsGrp.obsRequest.qO2 = ObsGrp.observations[i].defaultObservation.qO2
                            ObsGrp.obsRequest.qO2_label = ObsGrp.observations[i].defaultObservation.qO2_label
                            ObsGrp.obsRequest.dataType = ObsGrp.observations[i].defaultObservation.dataType
                            ObsGrp.obsRequest.id = ObsGrp.observations[i].defaultObservation.id;
                            ObsGrp.quals = ObsGrp.observations[i].qualifiers;
                            ObsGrp.obsRequest.o3id = ObsGrp.obsRequest.o3id.concat(ObsGrp.obsRequest.id)
                            //console.log('termIds are',ObsGrp.obsRequest);
                            /!*for(var j=0; j< ObsGrp.observations[i].termIds.length;j++) {
                                ObsGrp.obsRequest.termIds.push()
                                //console.log($scope.vm.sels[i].termNames[j])
                            }*!/

                        }
                        //console.log($scope.vm.selObs.length)
                    })

                    //$scope.group.selMultiObsGrps.count = $scope.vm.selObs.length
                    ObsGrp.count = $scope.vm.selObs.length;

                    console.log('obsGrp request is',ObsGrp.obsRequest, 'quals are', ObsGrp.quals);

                }*/

                /*$scope.lock = function(obsGrp){


                    // $scope.$apply(function() {
                        obsGrp.observations.forEach(function (group) {
                            group.isGrouped = true;
                            /!*if(group.defaultObservation){
                             group.defaultObservation.isSelected = false
                             group.defaultObservation.isActive = false
                             }*!/
                        })
                    // })


                    //console.log('LOCKING',obsGrp)
                    //var lockedGrp = {}
                    //lockedGrp.name="group 1";
                    //lockedGrp.observations=$scope.vm.sels.groups;
                    //obsGrp.isLocked = true;
                    //console.log('LOCKING',obsGrp)
                   // angular.forEach(obsGrp.observations,function(obs){
//
  //                  })
                }*/
            },
            replace:true,
            template:
                '<li ng-hide="group.isGrouped">'+

                    /* > */
                    '<div class="node-toggle">' +
                        '<a style="outline:none;" class="btn btn-sm btn-outline btn-link " ' +
                            'ng-click="group.isCollapsed = !group.isCollapsed" ng-init="group.isCollapsed = true"'+
                            'ng-class="{collapsed: group.isCollapsed}">'+
                        '</a>'+
                    '</div>'+

                    /* text */
                    '<span class="list-item-text"  ' +
                           'ng-class="{group: group.isSelectable, selected: group.isSelected, locked:group.isLocked}"' +
                           'ng-class="{selected: group.isSelected}"' +
                           'uib-tooltip="{{group.name}} ({{group.count}})">' +
                        '{{group.name}} ({{group.count}})' +
                    '</span>'+

                    /* checkbox */
                    '<div class="node-select" ng-if="group.isSelectable && !group.isLocked">'+
                        '<input cl-select cb="groupClicked" type="checkbox"  ng-model="group.isSelected" >' +
                        // '<a ng-if="group.isLocked" class="btn btn-xs btn-white" ><i class="fa fa-link"></i></a>'+
                    '</div>'+

                    /*Group control*/
                    '<span class="link-btn" ng-if="group.isDomain" ng-show="group.selMultiObsGrps.tempSelected.length>0" class="pull-right">' +
                        '<a ng-click="groupObservations()" class="btn btn-xs btn-white"><i class="fa fa-link"></i>&nbsp;&nbsp;Group Selected Events</a>'+
                    '</span>'+


                    '<ul uib-collapse="group.isCollapsed" id="{{group.code}}"  class="list-group">'+
                        '<li ng-if="group.isDomain" ng-show="group.selMultiObsGrps.groupedObservations.length > 0" class="animated fadeIn">' +
                            '<div class="selectDiv">' +
                                '<h4>Grouped Events</h4>'+
                                '<ul>'+
                                    '<li style="margin-bottom: 15px;" ng-repeat="obsGrp in group.selMultiObsGrps.groupedObservations">' +
                                        '<div class="grp-name">' +
                                            '<span>{{obsGrp.name}}</span>' +
                                            /*'<a class="btn btn-xs btn-white"><i class="fa fa-link"></i></a>'+
                                            '<a class="btn btn-xs btn-white"><i class="fa fa-unlink"></i></a>'+*/
                                        '</div>'+
                                        '<div style="position:absolute; right:5px;top:0px;">' +
                                             '<a class="switchery" charting-button id="obsgrp_{{obsGrp.id}}" ' +
                                                 'obs="obsGrp.obsRequest"  charting-opts="chartingOpts" quals="obsGrp.quals" style="color:#222f3f;" ' +
                                                 'ng-init="obsGrp.isActive = false" ' +
                                                 'ng-class="{on:obsGrp.isActive}" '+
                                                 'ng-click="obsGrp.isActive = !obsGrp.isActive; obsGrp.isLocked=true">' +
                                                 '<small></small>'+
                                             '</a>'+
                                        '</div>' +
                                        '<ul>' +
                                            '<li cl-tree-obs class="list-item-text" ng-repeat="obs in obsGrp.observations " ' +
                                            'obs="obs" ' +
                                            'charting-opts="chartingOpts">' +
                                            '</li>'+
                                        '</ul>'+
                                    '</li>'+
                                '</ul>'+
                            '</div>' +
                        '</li>'+

                        '<li cl-tree-obs class="list-item-text" ng-repeat="obs in group.terms " sels="group.selMultiObsGrps"  obs="obs" charting-opts="chartingOpts" callbck="localcallbck(request)"></li>'+
                    '</ul>'+
                '</li>',
            link: function (scope, element, attrs) {
                scope.$watch('group.isSelected', function(newVal) {
                    //console.log(newVal,scope.group.isSelected)
                    if (newVal) {
                            scope.group.terms.forEach(function(group){
                                group.isSelected = true//scope.group.isSelected;
                                if(group.defaultObservation){
                                    group.defaultObservation.isSelected = true
                                    group.defaultObservation.isActive = true
                                }
                            })
                        //}

                    }else{
                        if(scope.group.terms){
                            scope.group.terms.forEach(function(group){
                                group.isSelected = false;
                                if(group.defaultObservation){
                                    group.defaultObservation.isSelected = false
                                    group.defaultObservation.isActive = false
                                }
                            })
                        }
                    }
                })

                scope.$watch('group.isLocked', function(newVal) {
                    if (newVal) {
                        scope.group.terms.forEach(function(group){
                          group.isLocked = true;
                        })
                    }
                })
            }
        }
    })

    .directive('clTreeObs',function($compile){
        return{
            restrict:'EA',
            replace:true,
            scope:{
                chartingOpts:'=',
                obs:'='/*,
                search:'='*/,
                sels:'=',
                callbck:'&'
            },
            controller: function($scope){
                $scope.getObsRequest = function(obs){
                    //console.log("In here",obs)
                    /*$scope.callbck()(obs).then(function(request){
                        $scope.obsRequest = request;

                        angular.element('#sc_'+sc).trigger('click');
                    })*/

                    //console.log($scope)
                    //console.log()
                    //($scope.callbck())(obs);
                    $scope.callbck({ request: obs })
                   // $scope.obsRequest = $scope.callbck()(obs);

                }
            },
            template:

           '<div ng-class="{selected: obs.isSelected}">' +
                   /*/!* checkbox *!/
                   '<div class="node-select" ng-if="obs.isSelectable && !obs.isLocked">'+
                   '<input cl-select cb="groupClicked" type="checkbox"  ng-model="group.isSelected" >' +
                   // '<a ng-if="group.isLocked" class="btn btn-xs btn-white" ><i class="fa fa-link"></i></a>'+
                   '</div>'+*/
                '<div class="plotting-switch">'+
                    '<a ng-hide="obs.isSelected || obs.isLocked" class=" switchery" charting-button id="obs_{{obs.id}}" ' +
                        'obs="obs.defaultObservation" quals="obs.qualifiers" charting-opts="chartingOpts" style="color: #222f3f;" ' +
                        'ng-init="obs.defaultObservation.isActive = false" ' +
                        'data-ng-disabled="obs.isSelected" '+
                        'ng-class="{on:obs.defaultObservation.isActive}" '+
                        'ng-click="obs.defaultObservation.isActive = !obs.defaultObservation.isActive"> ' +
                        '<small></small>'+
                    '</a>'+

           /*'<a  class="switchery"  id="obs_{{obs.id}}" ' +
            'obs="obs.defaultObservation" quals="obs.qualifiers" charting-opts="chartingOpts" style="color: #222f3f;" ' +
            'ng-init="obs.defaultObservation.isActive = false" ' +
            'data-ng-disabled="obs.isSelected" '+
            'ng-class="{on:obs.defaultObservation.isActive}" '+
            'ng-click="getObsRequest(obs)"> ' +
            '<small></small>'+
            '</a>'+*/

                    '<a ng-show="obs.isLocked" class="btn btn-xs btn-white" disabled="disabled"><i class="fa fa-link"></i></a>'+
                '</div>'+
                '<span>{{obs.defaultObservation.o3}}</span>'+

                /*'<cl-option-menu obs="obs" charting-opts="chartingOpts"  class="qualifier-menu"></cl-option-menu>'+*/
            '</div>',

            link: function (scope, element, attrs) {
                if (angular.isArray(scope.obs.terms)) {
                    $compile("<cl-tree-obs-grp group='obs' sels='sels'  charting-opts='chartingOpts'></cl-tree-obs-grp>")
                    (scope, function(cloned){
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
            replace:true,
            controller: function ($scope, $element) {
                //console.log('menu scope',$scope.obs)
            },
            template:
            '<div class="dropdown" uib-dropdown>'+
                '<a class="dropdown-toggle" href uib-dropdown-toggle>'+
                    '<i class="fa fa-ellipsis-v"></i>'+
                '</a>'+
                '<ul class=" dropdown-menu dropdown-menu-right plotting-options"> ' +
                    '<li class="dropdown-header">Chart Value for {{obs.o3}}</li>'+
                    '<li>' +
                        '<div ng-repeat="var in obs.qualifiers" class="checkbox">'+
                            '<input id="checkbox_{{var.id}}" type="checkbox" ' +
                                    'charting-button  obs="var"  ' +
                                    'ng-init="var.isActive = false" ng-click="var.isActive = !var.isActive" ' +
                                    'charting-opts="chartingOpts" >' +
                            '<label for="checkbox_{{var.id}}">{{var.qO2_label}}</label>' +
                        '</div>' +
                    '</li> ' +
                    /*'<li role="separator" class="divider"></li>'+
                    '<li><a href><i class="fa fa-arrow-circle-o-down"></i>&nbsp; Add to cart</a></li>'+*/
                '</ul>'+
            '</div>'
        }
    })

    .directive('clSelect',function($timeout){
        return {
            restrict: 'A',
            require: 'ngModel',

            link: function($scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue){
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_square-aero'

                    }).on('ifChanged', function(event) {
                        $scope.$parent.checkChanged(event.target.checked)

                        //console.log("Im clicked",)
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                    });
                });
            }
        };
    })


