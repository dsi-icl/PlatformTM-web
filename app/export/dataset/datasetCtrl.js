(function(angular) {
    'use strict';

    //// JavaScript Code ////
    function datasetCtrl($scope,$stateParams,datasetService) {

        var vm = this;
        vm.projectId = $stateParams.studyId;

    }

    //// Angular Code ////

    angular.module('bioSpeak.export').controller('datasetCtrl', ['$scope', '$stateParams', 'datasetService', datasetCtrl]);

})(angular);