'use strict';
function ProjectHomeCtrl($scope,$state,$stateParams,projService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.ready = false;
}

angular.module('bioSpeak.projectHome')
    .controller('ProjectHomeCtrl',['$scope','$state','$stateParams','projService',ProjectHomeCtrl]);