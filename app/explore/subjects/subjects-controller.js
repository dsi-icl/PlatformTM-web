/**
 * Created by iemam on 06/05/2015.
 */
'use strict'
function SubjectsController($stateParams, subjectDataService, SubjectXF, DCchartingService) {
    var vm = this;

    var projectId = $stateParams.projectId;
    vm.title = "Subjects";
    vm.show = 'plots';

    vm.chartingOpts = {
        projectId: $stateParams.projectId,
        chartGroup: "subject",
        DCchartService: "DCchartingService",
        xfilterService: "SubjectXF"
    };

    subjectDataService.initSubjData(projectId).then(function (response) {
        vm.SCs = response.scs;
        vm.TPs = response.tps;
        vm.DEs = response.des;

        SubjectXF.initXF(response.xfdata);

    })
    // subjectDataService.getSubjCharacteristics(projectId)
    //     .then(function (response) {
    //         vm.SCs = response.SCs;
    //         vm.TPs = response.TPs;
    //         vm.DEs = response.DEs;
    //     });

    // SubjectXF.refreshCf(projectId);
}

angular.module('biospeak.explorer')
    .controller('SubjectsCtrl', ['$stateParams', 'subjectDataService', 'SubjectXF', 'DCchartingService', SubjectsController])