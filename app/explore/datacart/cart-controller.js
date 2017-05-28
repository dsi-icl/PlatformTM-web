
'use strict'
function cartController($state,$stateParams,explorerService) {
    //scope.add filters from exportService
    //$scope.cart = exportService.getCart();

    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.queryId = $stateParams.queryId;

   /* $scope.$watch('vm.cartservice.clickclack()',function (newval) {
        //console.log(newval)
        vm.cartQuery = cartService.getCurrentCartQuery();
    },true)*/





    vm.loadQuery = function(queryId){
        $state.go('explore',{
            projectId: vm.projectId,
            queryId: queryId});
    }


}

angular.module('biospeak.explorer')
    .controller('cartCtrl', ['$state','$stateParams','explorerService',cartController]);