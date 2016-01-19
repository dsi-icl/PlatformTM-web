/**
 * Created by iemam on 06/05/2015.
 */
angular.module('biospeak.assays',[])

    .controller('AssayCtrl', ['$scope','$stateParams','AssayCf','ExportCriteria','$timeout',function($scope,$stateParams,AssayCf,ExportCriteria,$timeout) {

        $scope.isSamplesCollapsed = true;
        $scope.isFactorsCollapsed = true;
        $scope.GEXsampleCharacteristics = ['class','sampleType','batch'];
        $scope.luminexSampleChars = [];
        $scope.cytofSampleChars = ['Count','% Total'];
        $scope.expFactors = ['Treatment','DaysAfterVaccination'];

        var initEFs = ['Treatment','DaysAfterVaccination'];

        $scope.assayChartContainerId = "assayPlots";
        $scope.sampleChartContainerId = "samplePlots";
        $scope.TP = "Transcription Profiling";
        $scope.chartGroup = "assay";

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
        $scope.cf = AssayCf;

        $scope.chartService = "AssayCf"

        $scope.criteria = ExportCriteria

        $scope.addAssayGrp = function(assayType){
            ExportCriteria.addAssayGrp(assayType)
        }

        $scope.addCriterion = function(sc,assayType){
            console.log(sc)
            ExportCriteria.addCriterion(sc,assayType)

        }
    }])