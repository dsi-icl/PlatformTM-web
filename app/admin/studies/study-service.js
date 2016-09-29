/**
 * Created by iemam on 15/08/2016.
 */
'use strict'
function StudyService($resource, ngAppConfig) {
    var StudyFactory = {};
    
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    console.log(serviceBase);

    
    var _studyResource =  $resource(serviceBase+'api/studies/:studyId',{},{
        update:{
            method: 'PUT',
            params: {studyId: '@id'}
        }/*,
        getActivitiesForProject:{
            method: 'GET',
            url : serviceBase+'api/projects/:projectId/activities',
            isArray : true
            /!*params:{studyId}*!/
        },
        getProjectByAccession:{
            method: 'GET',
            url : serviceBase+'api/projects/accession/:projectId/',
            // isArray : true
            /!*params:{studyId}*!/
        },
        getProjectById:{
            method: 'GET',
            url : serviceBase+'api/projects/id/:projectId/',
            // isArray : true
            /!*params:{studyId}*!/
        }*/
    });

    console.log(_studyResource)
    StudyFactory.getStudyResource = _studyResource;


    return StudyFactory

}
angular.module('bioSpeak.config')
    .factory('StudyService',['$resource','ngAppConfig', StudyService])