/**
 * Created by iemam on 15/08/2016.
 */
'use strict'
function ProjectService($resource, ngAppConfig) {
    var ProjectFactory = {};
    
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    console.log(serviceBase);

    
    var _projectResource =  $resource(serviceBase+'api/projects/:projectId',{},{
        update:{
            method: 'PUT',
            params: {projectId: '@id'}
        },
        getActivitiesForProject:{
            method: 'GET',
            url : serviceBase+'api/projects/:projectId/activities',
            isArray : true
            /*params:{studyId}*/
        },
        getProjectByAccession:{
            method: 'GET',
            url : serviceBase+'api/projects/accession/:projectId/',
            // isArray : true
            /*params:{studyId}*/
        },
        getProjectById:{
            method: 'GET',
            url : serviceBase+'api/projects/id/:projectId/',
            // isArray : true
            /*params:{studyId}*/
        },
        get:{
            method:'GET',
            isArray : true
        }
    });

    console.log(_projectResource)
    ProjectFactory.getProjectResource = _projectResource;


    return ProjectFactory

}
angular.module('bioSpeak.config')
    .factory('ProjectService',['$resource','ngAppConfig', ProjectService])