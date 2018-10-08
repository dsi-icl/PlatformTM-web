function defineController($scope, $state, $stateParams){

    var vm = this;

    vm.projectId = $stateParams.projectId;
    vm.stateName = "Define";
    vm.folderId;
    vm.goBack = function () {
        $state.go('project.manager.main',{
            projectId: vm.projectId});
    }

}

angular.module('bioSpeak.import')
    .controller('defineController',['$scope','$state','$stateParams',defineController]);