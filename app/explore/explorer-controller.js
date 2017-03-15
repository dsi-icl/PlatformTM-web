/**
 * Created by iemam on 08/07/2014.
 */
'use strict';
function ExplorerCtrl($scope,$state,$stateParams) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.queryId = $stateParams.queryId;
}

/* Controllers */

angular.module('biospeak.explorer')
    .controller('ExplorerCtrl',['$scope','$state','$stateParams',ExplorerCtrl])
