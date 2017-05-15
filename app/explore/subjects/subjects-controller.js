/**
 * Created by iemam on 06/05/2015.
 */
'use strict'
function SubjectsController($scope,$stateParams,subjectDataService, SubjectXF,DCchartingService,cartService, $timeout){
    var vm =  this;

    var projectId = $stateParams.projectId;
    vm.title = "Subjects";
    vm.show='plots';

    //$scope.subjectFilter = exportService.getSubjectFilter();
    vm.cart = [];

    vm.chartingOpts = {
        projectId : $stateParams.projectId,
        chartContainerId : "subject-plots",
        chartGroup : "subject",
        DCchartService : "DCchartingService",
        xfilterService : "SubjectXF",
        filtersService: "filtersService"

    };

    SubjectXF.resetXF();


    $scope.cartService = cartService




   // $scope.$watch('cartService.cartIsReady()',function (ready) {
        //console.log(ready)
      //  if(ready){

            subjectDataService.getSubjCharacteristics(projectId)
                .then(function(response){
                    //console.log(response);
                    vm.SCs = response.SCs;
                    vm.TPs = response.TPs;
                    vm.DEs = response.DEs;

                    //currentCartSubjObRequests = cartService.getCartSubjObsReq();

                    //console.log("SAVED SUBJECT OBSERVATION REQUESTS: ",currentCartSubjObRequests);
                    SubjectXF.refreshCf(projectId,currentCartSubjObRequests).then(function(res){
                        /*angular.forEach(currentCartSubjObRequests, function(sc) {
                            console.log('#sc_', sc);
                            angular.element('#sc_' + sc.id).trigger('click');
                        })*/
                    });
                })


     //   }

  //  },true)

    var currentCartSubjObRequests

    //Gets data for StudyId, Arm and Site



}

angular.module('biospeak.explorer')
    .controller('SubjectsCtrl', ['$scope','$stateParams','subjectDataService','SubjectXF','DCchartingService','cartService','$timeout',SubjectsController])