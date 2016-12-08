/**
 * Created by iemam on 06/05/2015.
 */
'use strict'
function SubjectsController($scope,$stateParams,subjectDataService, SubjCf,DCchartingService,filtersService, $timeout){
    var projectId = $stateParams.projectId;
    $scope.title = "Subjects";
    $scope.show='plots';

    //$scope.subjectFilter = exportService.getSubjectFilter();
    $scope.cart = [];

    $scope.chartingOpts = {
        projectId : $stateParams.projectId,
        chartContainerId : "subject-plots",
        chartGroup : "subject",
        DCchartService : "DCchartingService",
        xfilterService : "SubjCf",
        //exportService : "exportService",
        filtersService: "filtersService"

    };

    $scope.addToCart = function(type) {

        /*var count = SubjCf.getCountGroup().value()

         exportService.addToCart(type, count, $scope.projectId, function(){
         toaster.pop({
         type: 'success',
         title: 'Data Saved',
         body: '',
         showCloseButton: true,
         timeout: 1000
         })
         })*/



        //console.log(exportService.getCart());
    };

    //Gets data for StudyId, Arm and Site
    subjectDataService.getSubjCharacteristics(projectId)
        .then(function(data){
            $scope.subjCharsDB = data.SCs;
            //console.log('all scs',$scope.subjCharsDB)

            /*SubjCf.refreshCf(projectId).then(
                function(subjChars){
                    //console.log('default scs',subjChars)
                    DCchartingService

                    $scope.initSCs = subjChars
                    $timeout(function() {
                        angular.forEach(subjChars, function(sc) {
                            console.log('#isc_'+sc)

                            /!**************TEMP HACK******************!/
                            var dt = 'string'
                            if(sc == 'age') dt = 'positiveInteger'
                            DCchartingService.createChart(sc,'subject',SubjCf,'Count',dt)
                            angular.element('#sc_'+sc).trigger('click');
                        });
                    },1000)
                }
            )*/
        })


}

angular.module('biospeak.explorer')
    .controller('SubjectsCtrl', ['$scope','$stateParams','subjectDataService','SubjCf','DCchartingService','filtersService','$timeout',SubjectsController])