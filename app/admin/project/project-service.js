/**
 * Created by iemam on 15/08/2016.
 */
'use strict'
function ProjectService($resource, ngAppConfig) {
    var ProjectFactory = {};
    
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    console.log(serviceBase);

    
    var _projectResource =  $resource(serviceBase+'projects/:projectId',{},{
        update:{
            method: 'PUT',
            params: {projectId: '@id'}
        },
        getActivitiesForProject:{
            method: 'GET',
            url : serviceBase+'projects/:projectId/activities',
            isArray : true
        },
        getProjectByAccession:{
            method: 'GET',
            url : serviceBase+'projects/accession/:projectId/',
            // isArray : true
        },
        getProjectById:{
            method: 'GET',
            url : serviceBase+'projects/id/:projectId/'
        },
        get:{
            method:'GET',
            isArray : true
        }
    });

    ProjectFactory.getProjectResource = _projectResource;


    return ProjectFactory

}
angular.module('bioSpeak.config')
    .factory('ProjectService',['$resource','ngAppConfig', ProjectService])