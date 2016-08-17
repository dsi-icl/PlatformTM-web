(function(angular) {
    'use strict';

    function exportListCtrl($scope,$stateParams,exportService) {

        var vm = this;
        vm.projectId = $stateParams.studyId;

    }

    angular.module('bioSpeak.export')
        .controller('exportListCtrl', ['$scope', '$stateParams', 'exportService', exportListCtrl]);

})(angular);