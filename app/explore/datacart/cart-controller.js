
'use strict'
function cartController($scope,$state,$stateParams,cartService,XFilterLinker,$timeout) {
    //scope.add filters from exportService
    //$scope.cart = exportService.getCart();

    var vm = this;
    vm.projectId = $stateParams.projectId

    vm.query = {}


    vm.cartservice = cartService;

    cartService.clearCurrentCart();

    //vm.cart = {}

    /*cartService.getUserSavedQueries(vm.projectId).then(function(queries){
        vm.savedQueries = {};
    })*/


    /*filtersService.getUserSavedFilters($stateParams.projectId)
     .then(function(data) {
     vm.savedFilters = data.filters;
     })*/

    //vm.subjFilters = filtersService.getFiltersFor('subject')


    $scope.$watch('vm.cartservice.clickclack()',function (newval) {
       console.log("INSIDE WATCH, ",newval);
        vm.query.scs = cartService.getCurrentSCS();
        vm.query.cobs = cartService.getCurrentObservations();
        vm.query.assaypanels = cartService.getCurrentAssayPanels();
        //$scope.apply()

        console.log(vm.query)

    },true)


    vm.saveQuery = function(){
        console.log(vm.query)
        cartService.saveQuery(vm.query)
    }

    vm.saveToCartAndCheckout = function(){
        cartService.saveQuery(vm.query, vm.projectId).then(function(response){
            //console.log(response.cartId)
            $state.go('datacart.checkout',{
                projectId: vm.projectId,
                cartId: response.cartId});
        })

    }

    // vm.removeFilter = function(chartGroup,obs){
    //     //if(chartGroup == 'subject')
    //     console.log('remove filter ',obs, 'from ', chartGroup)
    //     XFilterLinker.removeFilter(chartGroup,obs);
    // }
    //
    // vm.resetAllFilters = function(){
    //     console.log('remove all filters ')
    // }
    //
    // vm.saveFilters = function(){
    //     vm.query.subjFilters = vm.subjFilters;
    //     vm.query.clinicalFilters = vm.clinicalFilters;
    //     console.log(vm.query)
    // }

}

angular.module('biospeak.explorer')

    .controller('cartCtrl', ['$scope','$state','$stateParams','cartService','XFilterLinker','$timeout',cartController]);