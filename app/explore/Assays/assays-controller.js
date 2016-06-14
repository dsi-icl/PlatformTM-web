/**
 * Created by iemam on 06/05/2015.
 */
angular.module('biospeak.assays',[])

    .controller('AssayCtrl', ['$scope','$stateParams','AssayCf','assayDataService','$q','$timeout',function($scope,$stateParams,AssayCf,assayDataService,$q,$timeout) {

        //$scope.isSamplesCollapsed = true;
        //$scope.isFactorsCollapsed = true;
        $scope.GEXsampleCharacteristics = ['class','sampleType','batch'];
        //$scope.luminexSampleChars = [];
        //$scope.cytofSampleChars = ['Count','% Total'];
        //$scope.expFactors = ['Treatment','DaysAfterVaccination'];

        //var initEFs = ['Treatment','DaysAfterVaccination'];

        //$scope.assayChartContainerId = "assayPlots";
        //$scope.sampleChartContainerId = "samplePlots";
        //$scope.TP = "Transcription Profiling";
        //$scope.chartGroup = "assay";

        $scope.vm = {}
        $scope.vm.show="table";

        $scope.chartingOpts = {
            projectId : $stateParams.studyId,
            chartContainerId : "assay-plots",
            chartGroup : "assay",
            DCchartService : "DCchartingService",
            xfilterService : "AssayCf",
            exportService : "exportService"

        };


        var projectId = $stateParams.studyId;
        $timeout(function() {
        assayDataService.getAssays(projectId).then(function(data){
            var assays = data.assays

            console.log(assays)

            if(assays!='null'){
                angular.forEach(assays, function(assay) {
                    AssayCf.initializeXf(assay.id);
                });

                var promise = $q.all(null);


                angular.forEach(assays, function(assay){
                    promise = promise.then(function(){
                        return AssayCf.refreshCf(projectId, assay.id).then(function (sampleCols){
                            console.log('default scs', sampleCols)
                            //$scope.responses.push(sampleCols);
                            //$scope.luminexSampleChars = sampleCols
                            //$timeout(function() {
                            //    angular.forEach(subjChars, function(sc) {
                            //        //console.log('#isc_'+sc)
                            //        DCchartingService.createChart(sc,'subject',SubjCf,'Count')
                            //        angular.element('#sc_'+sc).trigger('click');
                            //    });
                            //},8000)

                        });
                    });
                });


                promise.then(function(){
                    //This is run after all of your HTTP requests are done
                    console.log("DONE")
                })

                $scope.vm.assays = assays;
            }





        })
        },10000)





        //$timeout(function() {
        //    AssayCf.refreshCf(projectId, assayId).then(
        //        function (sampleCols) {
        //            console.log('default scs', sampleCols)
        //
        //            $scope.luminexSampleChars = sampleCols
        //            //$timeout(function() {
        //            //    angular.forEach(subjChars, function(sc) {
        //            //        //console.log('#isc_'+sc)
        //            //        DCchartingService.createChart(sc,'subject',SubjCf,'Count')
        //            //        angular.element('#sc_'+sc).trigger('click');
        //            //    });
        //            //},8000)
        //        }
        //    )
        //},10000)


        //AssayCf.setup($scope).then(
        //    function(){
        //        $timeout(function() {
        //            angular.forEach(initEFs, function(ef) {
        //                angular.element('#ef_'+ef).trigger('click');
        //            });
        //        },100)
        //
        //    }
        //)
        //$scope.cf = AssayCf;
        //
        //$scope.chartService = "AssayCf"
        //
        //$scope.criteria = ExportCriteria
        //
        //$scope.addAssayGrp = function(assayType){
        //    ExportCriteria.addAssayGrp(assayType)
        //}

        //$scope.addCriterion = function(sc,assayType){
        //    console.log(sc)
        //    ExportCriteria.addCriterion(sc,assayType)
        //
        //}
    }])