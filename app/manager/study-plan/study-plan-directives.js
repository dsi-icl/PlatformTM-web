/**
 * Created by iemam on 03/07/2014.
 */
angular.module('eTRIKSdata.studyDesign')

    .directive('cdzArm', function(){
        return{
            restrict: 'AE',
            replace: true,
            template:'<div class="arm">'+
                '<div class="armbar"></div>'+
                '<div class="arm-container">'+
                '<div cdz-epoch-cell ng-repeat="epoch in arm.epochs" epoch="epoch"></div>'+
                '<div cdz-epoch-appender></div>'+
                '</div>'+
                '</div>'

        }
    })

    .directive('cdzEpochCell', function(){
        return{
            restrict: 'AE',
            replace: 'false',
            /*scope:{epoch: '='},*/
            /*scope:true,*/
            template:
                '<div  class="epoch" ng-class-odd="\'odd\'" >' +
                    '<div  class="epoch-header">{{epoch.name}}</div>'+
                    '<cdz-cell ng-repeat="cell in epoch.cells" cellname=cell.name>' +
                    '<span id="removeCell" data-toggle="tooltip" data-placement="top" title="Remove Cell" ng-show="isVisible" class="glyphicon glyphicon-remove-circle icon-remove"></span>' +
                    '</cdz-cell>' +
                    '<div cdz-cell-appender epoch="epoch"></div>'+

                    '</div>'/*,
             *//*Consider moving this to the parent controller?*//*
             controller: function($scope){
             $scope.addCellToEpoch = function (){
             console.log($scope);
             var cell = {
             "name" : "Enter name"
             };
             $scope.epoch.cells.push(cell);
             };
             }*/
        }
    })

    .directive('cdzCell', function(){
        return{
            restrict: 'AE',
            replace: 'false',
            /*scope:{cellname: '='},*/
            transclude:true,
            /*require:'^cdzStudyPlanner',*/
            template:
                '<div style="display: inline-block">' +
                    '<div  class="studySegment">' +
                    '<a href="#" e-ng-model="cellname" editable-text="cell.name"  e-form="editTextForm" buttons="no" blur="submit">{{cell.name || "Enter name"}}</a>' +
                    '<span class="glyphicon glyphicon-pencil" ng-click="editTextForm.$show()"  ng-show="isVisible" style="color: #39b3d7; padding-left: 6px; font-size: 0.7em"></span>'+
                    '</div>'+
                    '<span ng-transclude=""></span>'+
                    '</div>'
        }
    })

    /*Appenders*/

    .directive('cdzCellAppender', function($compile) {
        return {
            restrict: 'AE',
            replace: 'true',
            template: '<div id="cellAppender" ng-show="isVisible" style="display: inline-block; font-size: 0.8em;" ng-click="addCell(epoch)">' +
                '<span class="glyphicon glyphicon-plus-sign" style="color: #39b3d7; margin-right: 3px; margin-top: 2px"></span>' +
                '<span class="glyphicon glyphicon-chevron-right" style="color: #39b3d7;margin-left: -10px;"></span>' +
                '</div>'
        }
    })

    .directive('cdzEpochAppender', function($compile) {
        return {
            restrict: 'AE',
            replace: 'true',
            template: '<div id="epochAppender" ng-show="isVisible" style="display: inline-block;vertical-align: middle;" ng-click="addEpoch(arm)">' +
                ' <span class="glyphicon glyphicon-plus-sign" style="color: #39b3d7; margin-right: 3px"></span>' +
                ' <span class="glyphicon glyphicon-chevron-right" style="color: #39b3d7;margin-left: -12px;"></span>' +
                '</div>'/*,
             link: function(scope, elem, attrs) {
             elem.bind('click', function() {
             *//*console.log(scope.arm);*//*
             scope.$apply(function() {
             scope.addEpoch(scope.arm)
             });

             });
             }*/
        }
    })

    .directive('cdzArmAppender', function(){
        return{
            restrict: 'AE',
            replace: true,
            template:'<div id="armAppend" ng-show="isVisible" ng-click="addArm()">'+
                '<span class="glyphicon glyphicon-plus-sign" style="color: #39b3d7; margin-left: 10px"></span>'+
                '<span class="glyphicon glyphicon-chevron-down" style="color: #39b3d7;margin-left: 9px;display: block;margin-top: -10px;"></span>'+
                '</div>'
        }
    })




    .directive('cdzStudyPlanner', function(){
        return{
            restrict: 'AE',
            replace: true,
            template:'<div>' +
                '<cdz-arm ng-repeat="arm in Arms" ></cdz-arm>'+
                '<cdz-epoch-header ></cdz-epoch-header>'+
                '<div cdz-arm-appender></div>'+
                '</div>',

            controller:function($scope){
                $scope.addCell = function(epoch){
                    var cell = {
                        "name" : ""
                    };
                    epoch.cells.push(cell);
                }

                $scope.addEpoch = function(arm,numOfCells){
                    var epoch = {
                        "name" : "New Epoch",
                        "cells": [/*{"name":""}*/]
                    };
                    numOfCells = typeof numOfCells !== 'undefined' ? numOfCells : 1;
                    for(var i=0; i<numOfCells; i++)
                        this.addCell(epoch)
                    arm.epochs.push(epoch);
                }

                $scope.addArm = function(){
                    var newarm = {
                        "armName": "Adult",
                        "epochs": []
                    }
                    angular.forEach($scope.Arms[0].epochs, function(epoch,i){
                        $scope.addEpoch(newarm,epoch.cells.length);
                    });

                    $scope.Arms.push(newarm)
                }

                // Default the blocks to be visible.
                $scope.isVisible = false;

                $scope.toggleControls = function() {


                    $scope.isVisible = ! $scope.isVisible;
                    if($scope.isVisible){
                        $scope.btnText = "Save Plan"
                    }
                    if(!$scope.isVisible){
                        $scope.btnText = "Edit Plan"
                        this.savePlan();
                    }

                };

                $scope.savePlan = function(){
                    console.log("I'm saving....")
                }

            }
        }
    })