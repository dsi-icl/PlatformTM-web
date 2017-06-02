
'use strict'
function cartController($state,$stateParams,explorerService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.queryId = $stateParams.queryId;
}

angular.module('biospeak.explorer')
    .controller('cartCtrl', ['$state','$stateParams','explorerService',cartController]);