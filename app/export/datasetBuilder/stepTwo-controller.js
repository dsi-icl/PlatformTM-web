/**
 * Created by iemam on 06/10/2015.
 */

'use strict';
function stepTwoController($scope,$state,$stateParams,wizardService){

    var activityId = $stateParams.activityId;
    var datasetId = $stateParams.datasetId;
    var fileName = $stateParams.file;
    var fileId = $stateParams.fileId;
    var standardFileId;

    var step2vm = this;

    step2vm.ionSliderOptions1 = {
        min: 0,
        max: 5000,
        type: 'double',
        prefix: "$",
        maxPostfix: "+",
        prettify: false,
        hasGrid: true
    };

    step2vm.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];
    step2vm.multipleDemo = {};
    step2vm.multipleDemo.colors = ['Blue','Red'];

    step2vm.treeData =   [
        { id : 'ajson1', parent : '#', text : 'Simple root node', state: { opened: true} },
        { id : 'ajson2', parent : '#', text : 'Root node 2', state: { opened: true} },
        { id : 'ajson3', parent : 'ajson2', text : 'Child 1', state: { opened: true} },
        { id : 'ajson4', parent : 'ajson2', text : 'Child 2' , state: { opened: true}}
    ]

    step2vm.treeConfig = {
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

    step2vm.nodeSelected = function (node,selected,event) {
        filters.push();
        $scope.$apply();

    };

    step2vm.nodeDeselected = function (node,selected,event) {
        //console.log('node deselected',node,selected,event);
    };
}


angular.module('bioSpeak.export')
    .controller('stepTwoController',['$scope','$state','$stateParams','wizardService',stepTwoController])


