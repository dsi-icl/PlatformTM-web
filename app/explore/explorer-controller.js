/**
 * Created by iemam on 08/07/2014.
 */
'use strict';
function ExplorerCtrl($scope,$state,$stateParams,XFilterLinker, assayDataService, explorerService, DCchartingService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.queryId = $stateParams.queryId;

    vm.cartQuery = null;
    vm.savedQueries = null;
    vm.assays = null;

    vm.chartingOpts = {
        projectId : $stateParams.projectId,
        subjChartGrp : "subject",
        clinicalChartGrp: "clinical",
        DCchartService : "DCchartingService",
        subjectXFservice : "SubjectXF",
        assayXFservice: "AssayXF",
        assayChartGrp: "assay",
        filtersService: "filtersService"
    };
    vm.loaded = false;

    vm.showCart = false;

    XFilterLinker.initAll();
    DCchartingService.init();

    if(vm.queryId){
        explorerService.getCartQuery(vm.projectId,vm.queryId).then(function(query){
            vm.cartQuery = query.cart;
            vm.projectAcc = query.cart.projectAcc;
            vm.loaded = true;
        });
    }else {
        explorerService.getNewCartQuery(vm.projectId).then(function(query){
            vm.cartQuery = query.cart;
        })
    }

    $scope.assayDataService = assayDataService;
    $scope.$watch('assayDataService.assaysRetrieved()',function (assays) {
        if(assays && !vm.assays) {
            vm.assays = assays;
        }
    },true);


    vm.plotSwitchClicked = function(obsReq, obsModule){
        var isActive = obsReq.isActive === true;

        if(isActive){
            explorerService.addToCart(obsReq, obsModule);
        }
        else{
            DCchartingService.removeChart(obsReq, obsModule);
            DCchartingService.renderGroup(vm.chartingOpts.subjChartGrp);
            DCchartingService.renderGroup(vm.chartingOpts.clinicalChartGrp);

            if(vm.assays !== null)
                vm.assays.forEach(function(assay){
                DCchartingService.renderGroup(assay.id);
            });

            explorerService.removeFromCart(obsReq, obsModule);
        }
        vm.cartObsCount = explorerService.getCartSize()
    };

    vm.onFiltered = function(obsId,module,filters, filter){
        var isRangeFilter = false;
        if(filter)
            isRangeFilter = (filter.filterType === 'RangedFilter');

        explorerService.applyFilter(obsId,filters,isRangeFilter,module).then(function(updatedCart){
            vm.cartQuery = updatedCart;
        });
    };

    vm.resetAll = function(){
        DCchartingService.clearAll(vm.chartingOpts.subjChartGrp);
        DCchartingService.clearAll(vm.chartingOpts.clinicalChartGrp);

        if(vm.assays)
            vm.assays.forEach(function(assay){
                DCchartingService.clearAll(assay.id);
            });

        XFilterLinker.resetAll();
        explorerService.clearCart();
    };

    vm.addAssayToCart = function(panel){
        console.log(panel)
        explorerService.addAssayPanelToCart(panel)
    };

    vm.saveQuery = function(){
        vm.cartQuery.IsSavedByUser = true;
        explorerService.saveQuery(vm.cartQuery,vm.projectId).then(function(){
            explorerService.getUserQueries(vm.projectId).then(function(response){
                vm.savedQueries = response.queries;
            })

        })
    };

    vm.saveToCartAndCheckout = function(){
        explorerService.saveQuery(vm.cartQuery, vm.projectId).then(function(response){
            $state.go('project.datacart',{
                projectId: vm.projectId,
                cartId: response.cartId});
        })
    }
}

angular.module('biospeak.explorer')
    .controller('ExplorerCtrl',['$scope','$state','$stateParams','XFilterLinker','assayDataService','explorerService','DCchartingService',ExplorerCtrl])
