/**
 * Created by iemam on 06/05/2015.
 */
angular.module('biospeak.assays',[])

    .controller('AssayCtrl', ['$scope','AssayCf','ExportCriteria','$timeout',function($scope,AssayCf,ExportCriteria,$timeout) {

        $scope.isSamplesCollapsed = true;
        $scope.isFactorsCollapsed = true;
        $scope.sampleCharacteristics = ['class','sampleType','batch'];
        $scope.expFactors = ['Treatment','DaysAfterVaccination'];

        var initEFs = ['Treatment','DaysAfterVaccination'];

        $scope.assayChartContainerId = "assayPlots";
        $scope.sampleChartContainerId = "samplePlots";
        $scope.TP = "Transcription Profiling";


        AssayCf.setup($scope).then(
            function(){
                $timeout(function() {
                    angular.forEach(initEFs, function(ef) {
                        angular.element('#ef_'+ef).trigger('click');
                    });
                },100)

            }
        )
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