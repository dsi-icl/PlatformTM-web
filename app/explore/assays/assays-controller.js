/**
 * Created by iemam on 06/05/2015.
 */


'use strict'
function AssaysController($stateParams,AssayXF,assayDataService,$q){

    var vm = this;

    vm.chartingOpts = {
        projectId : $stateParams.projectId,
       // chartGroup : "assay",
        DCchartService : "DCchartingService",
        xfilterService : "AssayXF"
    };


    assayDataService.reset();

    var projectId = $stateParams.projectId;
    assayDataService.getAssays(projectId).then(function(data){
            var assays = data.assays;

            if(assays!=='null'){
                angular.forEach(assays, function(assay) {
                    AssayXF.initializeXf(assay.id);
                });

                var promise = $q.all(null);

                angular.forEach(assays, function(assay){
                    promise = promise.then(function(){
                        return AssayXF.refreshCf(projectId,'', assay.id).then(
                            function (sampleCols){

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
    }

angular.module('biospeak.explorer')
    .controller('AssayCtrl', ['$stateParams','AssayXF','assayDataService','$q',AssaysController])