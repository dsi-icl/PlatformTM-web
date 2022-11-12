'use strict'
function AssessmentController($scope, $state, $stateParams, $timeout, SweetAlert, toaster, AssessmentService) {
    var vm = this;

    vm.projectId = $stateParams.projectId;
    vm.studyId = $stateParams.studyId;
    $scope.$parent.vm.stateName = "Define Assessments";
    $scope.$parent.vm.goBack = function () {
        $state.go('define.study.main', {
            projectId: vm.projectId,
            studyId: vm.studyId
        });
    }

    vm.statusOptions = ["Finished", "Ongoing", "Not started"];
    vm.selectTemplate = false;

    var assessment;
    if ($stateParams.assessmentId == 0) {
        console.log("New Project");
        assessment = new AssessmentService.getAssessmentResource();
        assessment.isNew = true;
        assessment.status = "";
        assessment.description = null;
        assessment.studyId = $stateParams.studyId;
        assessment.name = null;
        // assessment.associatedDatasets = [
        //     {
        //         "id": 0,
        //         "title": "title1",
        //         "description": "description1",
        //         "domain": "domain1",
        //         "isSelected": false
        //     }
        // ]

        vm.assessment = assessment;

        // AssessmentService.getDatasetResource.query(function (response) {
        //     console.log("querying for datasets", response)
        //     vm.assessment.associatedDatasets = response;
        // })

    }
    else if ($stateParams.assessmentId) {
        AssessmentService.getAssessmentResource.get({ studyId: $stateParams.studyId, assessmentId: $stateParams.assessmentId }, function (response) {
            assessment = response;
            assessment.isNew = false;
            vm.assessment = assessment
            console.log(vm.assessment);

            // AssessmentService.getDatasetResource.query(function (response) {
            //     console.log("querying for datasets", response)
            //     vm.assessment.datasets = response;
            // })
        });
    }

    vm.showDSvars = function (domain) {
        vm.showDS = domain;
    }

    vm.dontSaveAssessment = function () {
        vm.assessment = {}
        $state.go('define.study.main', {
            projectId: vm.projectId,
            studyId: vm.studyId
        }
        );
    }

    vm.saveAssessment = function () {
        if (vm.assessment.name != null && vm.assessment.name !== '') {

            if (vm.assessment.isNew) {
                vm.assessment.$save({ studyId: $stateParams.studyId }, function (response) {
                    toaster.pop('success', "SUCCESS", vm.assessment.name, " was successfully CREATED.", 8000);
                    $state.transitionTo('define.study.main', $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            }
            else {
                vm.assessment.$update({ studyId: $stateParams.studyId }, function (response) {
                    toaster.pop('success', "SUCCESS", vm.assessment.name, " was successfully UPDATED.", 8000);
                    $state.transitionTo('define.study.main', $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            }
        } else
            toaster.warning("Warning", "Assessment has no name!")
    };





}

angular.module('bioSpeak.config')
    .controller('AssessmentCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'SweetAlert', 'toaster', 'AssessmentService', AssessmentController]);