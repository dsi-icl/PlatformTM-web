/**
 * Created by iemam on 08/07/2014.
 */
'use strict';

/* Controllers */

angular.module('eTRIKSdata.explorer')


    .controller('SubjectsCtrl', ['$scope','SubjCf',function($scope, SubjCf) {
        $scope.title = "Subjects";
        $scope.subjChars =    ['Cohort','Age','Gender','Race','Status']
        //MOVE CF services to controllers instead of in the directive

        $scope.subjChartContainerId = 'subject-plots';
        $scope.section="Subjects";

        SubjCf.setup($scope)
        $scope.cf = SubjCf;

        $scope.chartService = "SubjCf"

    }])



    .controller('ClinicalCtrl', ['$scope','ClinicalDataResource','ClinicalCf',function($scope,ClinicalDataResource,ClinicalCf) {

        ClinicalDataResource.query(function(response){
            $scope.clinicalData = response;
        });

        //$scope.cf = ClinicalCf;
        $scope.chartContainerId = "clinical-plots";

        $scope.getChartingOpts = function(){
            var chartingOpts = {}
            chartingOpts.container = $scope.chartContainerId
            chartingOpts.chartingServiceName = "ClinicalCf"

            return chartingOpts;

        }

        ClinicalCf.setup($scope)




    }])

    .controller('AssayCtrl', ['$scope','AssayCf','ExportCriteria',function($scope,AssayCf,ExportCriteria) {

        $scope.isSamplesCollapsed = true;
        $scope.isFactorsCollapsed = true;
        $scope.sampleCharacteristics = ['SourceType','Localisation','SampleType'];
        $scope.expFactors = ['Treatment', 'TreatementResponse[TC]', 'TreatementResponse[RTV]',
                             'TreatementResponse[RECIST]', 'TreatementResponse[IC50]'];

        $scope.assayChartContainerId = "assayPlots";
        $scope.sampleChartContainerId = "samplePlots";
        $scope.TP = "Transcription Profiling";


        AssayCf.setup($scope)
        //$scope.cf = AssayCf;

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

    .controller('ExportCtrl',['$scope','ExportCriteria',function($scope,ExportCriteria) {
        $scope.criteria = ExportCriteria.criteria;
        //console.log($scope.criteria.showClinicalSection)
        $scope.number = 4;

        $scope.$on('filterApplied', function(event, ExportCriteria) {

            console.log("boradcast ok")
            console.log(ExportCriteria)
            $scope.number = ExportCriteria;
        });



    }])

    .controller('subjPlotsCtrl',['$scope', function($scope){

    }]);