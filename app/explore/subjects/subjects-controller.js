/**
 * Created by iemam on 06/05/2015.
 */
angular.module('biospeak.subjects',['eTRIKSdata.dcPlots'])

    .controller('SubjectsCtrl', ['$scope','$stateParams','subjectDataService','SubjCf','XFilterLinker','DCchartingService','exportService','toaster','$timeout',
        function($scope,$stateParams,subjectDataService, SubjCf,XFilterLinker,DCchartingService,exportService, toaster, $timeout) {

            var projectId = $stateParams.studyId;
            $scope.title = "Subjects";
            $scope.subjChartContainerId = 'subject-plots';
            $scope.projectId = projectId;

            //TEMP
            //$scope.cf = SubjCf;
            //$scope.chartservice = DCchartingService;
            //////////////////////

            $scope.DCchartService = "DCchartingService";
            $scope.xfilterService = "SubjCf";
            $scope.exportService = "exportService";

            $scope.chartGroup = "subject";
            $scope.show='plots';

            $scope.subjectFilter = exportService.getSubjectFilter();
            $scope.cart = [];

            $scope.addToCart = function(type) {

                exportService.addToCart(type, function(){
                    toaster.pop({
                        type: 'success',
                        title: 'Data Saved',
                        body: '',
                        showCloseButton: false,
                        timeout: 2000
                    })
                })



                //console.log(exportService.getCart());
            };

            //Gets data for StudyId, Arm and Site
            subjectDataService.getSubjCharacteristics(projectId)
                .then(function(data){
                    $scope.subjCharsDB = data.SCs;

                    SubjCf.refreshCf(projectId).then(
                        function(subjChars){
                            //console.log(subjChars)

                            $scope.initSCs = subjChars
                            $timeout(function() {
                                angular.forEach(subjChars, function(sc) {
                                    //console.log('#isc_'+sc)
                                    DCchartingService.createChart(sc,'subject',SubjCf)
                                    angular.element('#isc_'+sc).trigger('click');
                                });
                            },500)
                        }
                    )
                })


        }])