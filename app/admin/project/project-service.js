/**
 * Created by iemam on 15/08/2016.
 */
'use strict'
function projectService($http,$resource, ngAppConfig) {
    var ProjectFactory = {};
    
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    console.log(serviceBase);

    
    var _projectResource =  $resource(serviceBase+'projects/:projectId',{},{
        update:{
            method: 'PUT',
            params: {projectId: '@id'}
        },
        // getActivitiesForProject:{
        //     method: 'GET',
        //     url : serviceBase+'projects/:projectId/activities',
        //     isArray : true
        // },
        getSubjDataCollection:{
        method: 'GET',
            url : serviceBase+'projects/:projectId/subjDataCollection',
            isArray : true
        },
        getDescriptors:{
            method: 'GET',
            url : serviceBase+'projects/:projectId/descriptors',
            isArray : true
        },
        getClinicalDatasets:{
            method: 'GET',
            url : serviceBase+'projects/:projectId/datasets',
            isArray : true
        },
        getAssays:{
            method: 'GET',
            url : serviceBase+'projects/:projectId/assays',
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

    var _getProjectUsers = function(projectId){
        return $http({
            url: serviceBase + 'projects/' + projectId+'/users',
            method: 'GET'
        }).then(
            function(response){
                return response.data;
            }
        )
    }

    var _deleteProject = function(projectId){
        console.log("project-service: the project with following ID will be deleted",projectId);
        return $http({
            url: serviceBase + 'projects/' + projectId+'/remove',
            method: 'GET',
        }).then(
            function (response) {
                return {
                    projects: (response.data)
                }
            }
        )
    }

    ProjectFactory.getProjectResource = _projectResource;
    ProjectFactory.deleteProject = _deleteProject;
    ProjectFactory.getProjectUsers = _getProjectUsers;

    return ProjectFactory

}
angular.module('bioSpeak.config')
    .factory('projectService',['$http','$resource','ngAppConfig', projectService])