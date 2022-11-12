'use strict'
function AssessmentService($resource, ngAppConfig) {
    var AssessmentFactory = {};

    var serviceBase = ngAppConfig.apiServiceBaseUri;


    var _datasetResource = $resource(serviceBase + 'templates/clinical/:datasetId', {}, {
        update: {
            method: 'PUT',
            params: { datasetId: '@id' }
        },
        query: {
            method: 'GET',
            isArray: true
        }

    });

    // var _assessmentResource = $resource(serviceBase + 'studies/:studyId/', {}, {
    //     update: {
    //         method: 'PUT',
    //         params: { studyId: '@id', }
    //     }
    // });

    var _assessmentResource = $resource(serviceBase + 'studies/:studyId/assessments/:assessmentId', { studyId: '@studyId', assessmentId: '@assessmentId' }, {
        update: {
            url: serviceBase + 'studies/:studyId/assessments/:assessmentId',
            method: 'PUT',
            params: { studyId: '@studyId', assessmentId: '@assessmentId' }
        }
    });


    AssessmentFactory.getAssessmentResource = _assessmentResource;
    AssessmentFactory.getDatasetResource = _datasetResource;

    return AssessmentFactory

}
angular.module('bioSpeak.config')
    .factory('AssessmentService', ['$resource', 'ngAppConfig', AssessmentService])