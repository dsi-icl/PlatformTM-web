/**
 * Created by iemam on 06/05/2015.
 */
angular.module('biospeak.subjects',['eTRIKSdata.dcPlots'])

    .controller('SubjectsCtrl', ['$scope','$stateParams','subjectDataService','SubjCf','XFilterLinker','DCchartingService','filtersService','toaster','$timeout',
        function($scope,$stateParams,subjectDataService, SubjCf,XFilterLinker,DCchartingService,filtersService, toaster, $timeout) {

            var projectId = $stateParams.studyId;
            $scope.title = "Subjects";
            $scope.show='plots';

            //$scope.subjectFilter = exportService.getSubjectFilter();
            $scope.cart = [];

            $scope.chartingOpts = {
                projectId : $stateParams.studyId,
                chartContainerId : "subject-plots",
                chartGroup : "subject",
                DCchartService : "DCchartingService",
                xfilterService : "SubjCf",
                //exportService : "exportService",
                filtersService: "filtersService"

            };

            $scope.addToCart = function(type) {

                /*exportService.addToCart(type, function(){
                    toaster.pop({
                        type: 'success',
                        title: 'Data Saved',
                        body: '',
                        showCloseButton: false,
                        timeout: 2000
                    })
                })*/



                //console.log(exportService.getCart());
            };

            //Gets data for StudyId, Arm and Site
            subjectDataService.getSubjCharacteristics(projectId)
                .then(function(data){
                    $scope.subjCharsDB = data.SCs;
                    console.log('all scs',$scope.subjCharsDB)

                    SubjCf.refreshCf(projectId).then(
                        function(subjChars){
                            console.log('default scs',subjChars)

                            $scope.initSCs = subjChars
                            $timeout(function() {
                                angular.forEach(subjChars, function(sc) {
                                    //console.log('#isc_'+sc)
                                    DCchartingService.createChart(sc,'subject',SubjCf,'Count')
                                    angular.element('#sc_'+sc).trigger('click');
                                });
                            },500)
                        }
                    )
                })


        }])