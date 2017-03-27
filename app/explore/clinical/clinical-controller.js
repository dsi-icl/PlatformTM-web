/**
 * Created by iemam on 06/05/2015.
 */
'use strict'
function ClinicalController($scope,$stateParams,clinicalDataService,ClinicalCf,DCchartingService, cartService){

    $scope.vm = {};
    $scope.vm.show = 'plots';
    $scope.vm.ready = false;


    //TEMP
    $scope.cf = ClinicalCf;
    $scope.chartservice = DCchartingService;
    //////////////////////
    

    $scope.chartingOpts = {
        projectId : $stateParams.projectId,
        chartContainerId : "clinical-plots",
        chartGroup : "clinical",
        DCchartService : "DCchartingService",
        xfilterService : "ClinicalCf",
        filtersService: "filtersService",
        clinicalDataService: "clinicalDataService"
    };

    $scope.updateCurrentCart = function(obs) {

        //console.log(obs, obs.isActive)
        /*if(obs.isActive)
            cartService.addClinicalObs(obs);
        else
            cartService.removeClinicalObs(obs);*/
    };

    // console.log("calling clinical tree")
    clinicalDataService.getClinicalDataTree($scope.chartingOpts.projectId)
        .then(function(data){
            $scope.clinicalObservations = data.treeData;
            $scope.vm.ready = true;
        })

    /*$scope.getObsRequest = function(obs){
        var deferred = $q.defer();

        clinicalDataService.getObsRequestFor(obs).then(function(obsRequest){
            deferred.resolve(obsRequest);
        })

            console.log(obs)
        return deferred.promise
    }*/

}
angular.module('biospeak.explorer')
    .controller('ClinicalCtrl', ['$scope','$stateParams','clinicalDataService','ClinicalCf','DCchartingService',
        'cartService',ClinicalController])



