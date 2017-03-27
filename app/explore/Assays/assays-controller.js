/**
 * Created by iemam on 06/05/2015.
 */


'use strict'
function AssaysController($scope,$stateParams,AssayCf,assayDataService,cartService,$q){

    var vm = this;

    vm.GEXsampleCharacteristics = ['class','sampleType','batch'];

        // $scope.vm = {}
    vm.show="table";

    vm.chartingOpts = {
        projectId : $stateParams.projectId,
        chartContainerId : "assay-plots",
        chartGroup : "assay",
        DCchartService : "DCchartingService",
        xfilterService : "AssayCf",
        exportService : "exportService"

    };


    var projectId = $stateParams.projectId;
    assayDataService.getAssays(projectId).then(function(data){
            var assays = data.assays

            //console.log(assays)

            if(assays!='null'){
                angular.forEach(assays, function(assay) {
                    AssayCf.initializeXf(assay.id);
                });

                var promise = $q.all(null);


                angular.forEach(assays, function(assay){
                    promise = promise.then(function(){
                        return AssayCf.refreshCf(projectId,'', assay.id).then(
                            function (sampleCols){
                            // console.log('default scs', sampleCols)
                            //$scope.responses.push(sampleCols);
                            //$scope.luminexSampleChars = sampleCols
                            /*$timeout(function() {
                               angular.forEach(sampleCols, function(sc) {
                                   //console.log('#isc_'+sc)
                                   DCchartingService.createChart(sc,'assay',AssayCf,'Count')
                                   angular.element('#s_'+sc).trigger('click');
                               });
                            },8000)*/

                        });
                    });
                });


                promise.then(function(){
                    //This is run after all of your HTTP requests are done
                    //console.log("DONE")
                })

                vm.assays = assays;
            }

        })

    vm.addAssayToCart = function(panel){
        console.log(panel)
        cartService.addAssayPanelToCart(panel)
        //$scope.$apply();
    }

        
    }

angular.module('biospeak.explorer')
    .controller('AssayCtrl', ['$scope','$stateParams','AssayCf','assayDataService','cartService','$q',AssaysController])