/**
 * Created by iemam on 06/05/2015.
 */
angular.module('biospeak.subjects',['eTRIKSdata.dcPlots'])

    .controller('SubjectsCtrl', ['$scope','subjectDataService','SubjCf','$timeout',function($scope,subjectDataService, SubjCf,$timeout) {
        $scope.title = "Subjects";

        //$scope.subjChars =    ['Cohort','Age','Sex','Race','Ethnicity']
        $scope.subjCharsDB =
            ['study','arm','age','sex','race','ethnic'];

        //subjectDataService.getSubjCharacteristics('STD-BVS-01')
        //    .then(function(data){
        //        $scope.subjCharsDB = data;
        //        //console.log(data)
        //    })

        var initSCs = ['study','arm','age','sex']
        /*subjectDataService.getSubjCharacteristics('CRC305C')
         .then(function(data){
         $scope.subjChars = data;
         })*/
        //MOVE CF services to controllers instead of in the directive

        $scope.subjChartContainerId = 'subject-plots';
        $scope.section="Subjects";

        var projectId = "P-BVS";
        var projectId = "CRC305C";

        SubjCf.setup(projectId).then(
            function(){
                $timeout(function() {
                    angular.forEach(initSCs, function(sc) {
                        angular.element('#sc_'+sc).trigger('click');
                    });
                },100)

            }
        )
        $scope.cf = SubjCf;
        $scope.chartService = "SubjCf"

    }])