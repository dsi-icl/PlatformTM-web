
'use strict'
function cartController($scope,$state,$stateParams,cartService,XFilterLinker,$timeout) {
    //scope.add filters from exportService
    //$scope.cart = exportService.getCart();

    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.queryId = $stateParams.queryId;

    //vm.query = {}
    //vm.cartQuery = {};
    //cartService.clearCurrentCart();

    vm.cartservice = cartService;


    if(vm.queryId){
        cartService.getCartQuery(vm.projectId,vm.queryId).then(function(query){
            vm.cartQuery = query;
            console.log(query)

        });
    }else {
        cartService.getNewCartQuery(vm.projectId).then(function(query){
            vm.cartQuery = query;
        })
    }


    cartService.getUserQueries(vm.projectId).then(function(response){
        //console.log(response);
        vm.savedQueries = response.queries;
    })




    $scope.$watch('vm.cartservice.clickclack()',function (newval) {
        //console.log(newval)
        vm.cartQuery = cartService.getCurrentCartQuery();
    },true)



    vm.saveQuery = function(){
        console.log(vm.cartQuery)
        cartService.saveQuery(vm.cartQuery,vm.projectId).then(function(response){
            cartService.getUserQueries(vm.projectId).then(function(response){
                //console.log(response);
                vm.savedQueries = response.queries;
            })

        })
    }

    vm.saveToCartAndCheckout = function(){
        cartService.saveQuery(vm.cartQuery, vm.projectId).then(function(response){
            //console.log(response.cartId)
            $state.go('datacart.checkout',{
                projectId: vm.projectId,
                cartId: response.cartId});
        })

    }

    vm.loadQuery = function(queryId){
        $state.go('explore',{
            projectId: vm.projectId,
            queryId: queryId});
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