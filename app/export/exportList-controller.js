(function(angular) {
    'use strict';

    function exportListCtrl($scope,$stateParams,exportService) {

        var vm = this;
        vm.projectId = $stateParams.studyId;
        vm.loaded = false;
        
        exportService.getUserDatasetsForProject(vm.projectId).then(function(response){
            vm.datasets = response.datasets;
            console.log(vm.datasets)
            vm.loaded = true;
        })

    }

    angular.module('bioSpeak.export')
        .controller('exportListCtrl', ['$scope', '$stateParams', 'exportService', exportListCtrl]);

})(angular);