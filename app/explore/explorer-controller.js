/**
 * Created by iemam on 08/07/2014.
 */
'use strict';

/* Controllers */

angular.module('biospeak.explorer')


    .controller('ExplorerCtrl',['$scope','$state','$stateParams',function($scope,$state,$stateParams) {

        var vm = this;
        vm.projectId = $stateParams.projectId;

    }])
