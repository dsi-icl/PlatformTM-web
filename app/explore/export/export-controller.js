/**
 * Created by superkillball on 19/11/2015.
 */

angular.module('eTRIKSdata.explorer')

    .controller('DatacartCtrl', ['$scope','$stateParams','exportService','$timeout',
        function($scope,$stateParams,exportService,$timeout) {
            //scope.add filters from exportService
            $scope.cart = exportService.getCart();
        }])