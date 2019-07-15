'use strict';
function UserCtrl($scope,$state,$stateParams,userService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;


    userService.getProjectUsers().then(function(users){
        vm.users = datasets;
        vm.loaded = true;
    });


}

angular.module('bioSpeak.config')
    .controller('UserCtrl',['$scope','$state','$stateParams','userService',UserCtrl]);