/**
 * Created by iemam on 06/10/2015.
 */



    'use strict';

    function stepFourController($scope,$state,$stateParams,exportService){

        var vm = this;
        var projectId = $stateParams.studyId

        vm.availableTags = ['CyTOF','Microarray','Luminex','Samples','FACS','Adverse Events','Chemistry','Cytokines'];
        vm.multipleDemo = {};
        vm.selectedTags = [];

        vm.cancel = function(){
            datasetService.clearCriteria();
            $state.go('export.datasets',{studyId:projectId})
        }
        vm.prev = function(){
            //datasetService.clearCriteria();
            $state.go('export.wizard.preview.table',{studyId:projectId})
        }
        vm.finish = function(){
            //do something
            $state.go('export.datasets',{studyId:projectId})
        }


    }

    angular.module('bioSpeak.import')
        .controller('stepFourController',['$scope','$state','$stateParams','exportService',stepFourController]);
