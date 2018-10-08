function loaderController($scope, $state, $stateParams){

    var vm = this;

    vm.projectId = $stateParams.projectId;
    vm.stateName = "Data loading wizard";
    vm.folderId;
    vm.goBack = function () {
        $state.go('project.drive.files',{
            projectId: vm.projectId, dirId:vm.folderId});
    }

}

angular.module('bioSpeak.import')
    .controller('loaderController',['$scope','$state','$stateParams',loaderController]);