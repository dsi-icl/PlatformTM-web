/**
 * Created by iemam on 06/05/2015.
 */
angular.module('biospeak.subjects',['eTRIKSdata.dcPlots'])

    .controller('SubjectsCtrl', ['$scope','subjectDataService','SubjCf','$timeout',function($scope,subjectDataService, SubjCf,$timeout) {

        var projectId = "P-BVS";
        $scope.title = "Subjects";
        $scope.subjChartContainerId = 'subject-plots';
        //$scope.section="Subjects";
        $scope.projectId = projectId;
        $scope.cf = SubjCf;
        $scope.chartService = "SubjCf";
        $scope.chartGroup = "subject";



        //Gets data for StudyId, Arm and Site
        subjectDataService.getSubjCharacteristics(projectId)
            .then(function(data){
                $scope.subjCharsDB = data.SCs;

                SubjCf.initialize(projectId).then(
                    function(subjChars){
                        console.log(subjChars)

                        $scope.initSCs = subjChars
                        $timeout(function() {
                            angular.forEach(subjChars, function(sc) {
                                console.log('#isc_'+sc)
                                SubjCf.createChart(sc,'subject')
                                angular.element('#isc_'+sc).trigger('click');
                            });
                        },500)
                    }
                )
            })
    }])