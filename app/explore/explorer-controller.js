/**
 * Created by iemam on 08/07/2014.
 */
'use strict';
function ExplorerCtrl($scope,$state,$stateParams,SubjectXF, assayDataService, explorerService, DCchartingService) {
    var vm = this;
    vm.projectId = $stateParams.projectId;
    vm.queryId = $stateParams.queryId;

    vm.chartingOpts = {
        projectId : $stateParams.projectId,
        chartContainerId : "subject-plots",
        subjChartGrp : "subject",
        DCchartService : "DCchartingService",
        subjectXFservice : "SubjectXF",
        assayXFservice: "AssayXF",
        assayChartGrp: "assay",
        filtersService: "filtersService"

    };
    vm.subjCharRequests=[];

    if(vm.queryId){
        explorerService.getCartQuery(vm.projectId,vm.queryId).then(function(query){
            vm.cartQuery = query.cart;
            console.log(vm.cartQuery)

        });
    }else {
        explorerService.getNewCartQuery(vm.projectId).then(function(query){
            vm.cartQuery = query.cart;
            console.log(vm.cartQuery)
        })
    }

    vm.plotSwitchClicked = function(obsReq, plottingOptions){
        var isActive = obsReq.isActive === true;
        var chartId = (obsReq.name+"_chart").replace(/ /g,'_');
        var cardId = (obsReq.o3code+"_card").replace(/ /g,'_');

        console.log('plotting chart: ',chartId, ' in card:',cardId,' in container: ',plottingOptions.chartContainerId, 'for module',plottingOptions.chartGroup);



        if(isActive){
            explorerService.addToCart(obsReq, plottingOptions.chartGroup);
        }

        else{
            DCchartingService.resetChart(obsReq, plottingOptions.chartGroup)
            explorerService.removeFromCart(obsReq, plottingOptions.chartGroup);

        }


    };



    explorerService.getUserQueries(vm.projectId).then(function(response){
        vm.savedQueries = response.queries;
    });

    SubjectXF.resetXF();
    $scope.assayDataService = assayDataService;


    $scope.$watch('assayDataService.assaysRetrieved()',function (assays) {
        //console.log(assays);
        if(assays && !vm.assays) {
            vm.assays = assays;
            //console.log(vm.assays);
        }
    },true);

    vm.clearAll = function(){
        explorerService.clearCart();
        DCchartingService.resetAllCharts();
    }

}

/* Controllers */

angular.module('biospeak.explorer')
    .controller('ExplorerCtrl',['$scope','$state','$stateParams','SubjectXF','assayDataService','explorerService','DCchartingService',ExplorerCtrl])
