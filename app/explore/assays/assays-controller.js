/**
 * Created by iemam on 06/05/2015.
 */


'use strict'
function AssaysController($stateParams,AssayXF,assayDataService,$q) {

    var vm = this;

    vm.chartingOpts = {
        projectId: $stateParams.projectId,
        // chartGroup : "assay",
        DCchartService: "DCchartingService",
        xfilterService: "AssayXF"
    };


    assayDataService.reset();

    var projectId = $stateParams.projectId;

    assayDataService.getAssaysInit(projectId).then(function (result) {
        var assayxfObj =  result.xfdata;
        if(result.assays!=='null') {
            AssayXF.initXF(assayxfObj).then(function(){
                vm.assays = result.assays;
            })
        }
    })
}

angular.module('biospeak.explorer')
    .controller('AssayCtrl', ['$stateParams','AssayXF','assayDataService','$q',AssaysController])