'use strict'
function contentController($scope, $state, $stateParams, SweetAlert, fileService){

    var vm = this;

    vm.projectId = $stateParams.projectId;
    vm.dirId = $stateParams.dirId;
    vm.fileId = $stateParams.fileId;

    fileService.getContent(vm.projectId,vm.dirId)
        .then(function(result){
            vm.files = result.files;
            vm.dirs = result.folders;
            $scope.$parent.driveVM.contentLoaded = true
        })

}

angular.module('bioSpeak.DataStager')
    .controller('driveContentCtrl',['$scope', '$state','$stateParams','SweetAlert','fileService',contentController])