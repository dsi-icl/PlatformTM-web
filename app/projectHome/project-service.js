'use strict'
function projService($http,$resource, ngAppConfig) {
    var ProjectFactory = {};

    var serviceBase = ngAppConfig.apiServiceBaseUri;

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
            url : serviceBase+'projects/:projectId/'
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

    var _getProjectClinicalDatasets = function(projectId){
        return $http({
            url: serviceBase + 'projects/' + projectId+'/datasets/clinical',
            method: 'GET'
        }).then(
            function(response){
                return response.data;
            }
        )
    }

    var _getProjectSubjectDatasets = function(projectId){
        return $http({
            url: serviceBase + 'projects/' + projectId+'/datasets/subjDataCollection',
            method: 'GET'
        }).then(
            function(response){
                return response.data;
            }
        )
    }

    var _getProjectAssayDatasets = function(projectId){
        return $http({
            url: serviceBase + 'projects/' + projectId+'/datasets/assays',
            method: 'GET'
        }).then(
            function(response){
                return response.data;
            }
        )
    };

    var _downloadDataset = function(datasetId) {
        return $http({
            url: serviceBase + 'datasets/' + datasetId+'/download',
            method: 'GET'
        }).then(
            function(response){
                var headers = response.headers();
                var data = response.data;
                var filename;
                var contentType = headers['content-type'];
                var disposition = headers['content-disposition'];

                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([data], { type: contentType });
                    var url = window.URL.createObjectURL(blob);

                    linkElement.setAttribute('href', url);
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        var matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1]) {
                            filename = matches[1].replace(/['"]/g, '');
                        }
                    }
                    linkElement.setAttribute("download", filename);

                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    return {'url':url,'filename':filename};//.dispatchEvent(clickEvent);
                } catch (ex) {
                    console.log(ex);
                }
            }
        )
    };

    var _downloadDatasetDescriptor = function (datasetId) {
        return $http({
            url: serviceBase + 'datasets/' + datasetId+'/descriptor',
            method: 'GET'
        }).then(
            function(response){

                if(typeof response == 'undefined' || response == null || response == "")
                    return ;

                return response.data;
                //var link = document.createElement("a");
                //link.download = "info.txt";
                //var data = "text/json;charset=utf-8," + encodeURIComponent(response);
                //return data;
                //link.href = "data:" + data;
                //link.click();
                // var headers = response.headers();
                // var data = response.data;
                // var filename;
                // var contentType = "data:text/json"//headers['content-type'];
                // var disposition = headers['content-disposition'];
                //
                // var linkElement = document.createElement('a');
                // try {
                //     //var blob = new Blob([data], { type: contentType });
                //     //var url = window.URL.createObjectURL(blob);
                //     var json = encodeURIComponent(JSON.stringify(data));
                //     linkElement.setAttribute('href', url);
                //     if (disposition && disposition.indexOf('attachment') !== -1) {
                //         var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                //         var matches = filenameRegex.exec(disposition);
                //         if (matches != null && matches[1]) {
                //             filename = matches[1].replace(/['"]/g, '');
                //         }
                //     }
                //     linkElement.setAttribute("download", filename);
                //
                //     var clickEvent = new MouseEvent("click", {
                //         "view": window,
                //         "bubbles": true,
                //         "cancelable": false
                //     });
                //     return {'url':url,'filename':filename};.dispatchEvent(clickEvent);
                //} catch (ex) {
                //    console.log(ex);
                //}
            }
        )
    };
    var _requestAccess = function (projectId) {
        return $http({
            url: serviceBase + 'projects/' + projectId+'/requestaccess/',
            method: 'GET'
        }).then(
            function(response){
                return response.data;
            }
        )
    }


    ProjectFactory.getProjectResource = _projectResource;
    ProjectFactory.getProjectUsers = _getProjectUsers;
    ProjectFactory.getProjectAssayDatasets = _getProjectAssayDatasets;
    ProjectFactory.getProjectClinicalDatasets = _getProjectClinicalDatasets;
    ProjectFactory.downloadDataset = _downloadDataset;
    ProjectFactory.downloadDatasetDescriptor = _downloadDatasetDescriptor;
    ProjectFactory.getProjectSubjectDatasets = _getProjectSubjectDatasets

    return ProjectFactory

}
angular.module('bioSpeak.projectHome')
    .factory('projService',['$http','$resource','ngAppConfig', projService])