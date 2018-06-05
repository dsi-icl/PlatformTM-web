'use strict'
function projService($http,$resource, ngAppConfig) {
    var ProjectFactory = {};

    var serviceBase = ngAppConfig.apiServiceBaseUri;

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
                //console.log(headers,contentType,disposition)

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

        // $http({
        //     method: 'GET',
        //     url: serviceBase + 'datasets/' + datasetId+'/download'
        //     //params: {fileId: fileId},
        //     //responseType: ''
        // }).success(function (data, status, headers) {
        //
        //     headers = headers();console.log(headers);
        //
        //     var filename;
        //
        //
        //     /*headers = headers();
        //     var fileName = headers['x-filename'];
        //     var file = new Blob([data], {type: headers['content-type']});
        //     var fileURL = URL.createObjectURL(file);
        //     var a = document.createElement('a');
        //     a.href = fileURL;
        //     a.target = '_blank';
        //     a.download = fileName;
        //     document.body.appendChild(a);
        //     a.click();*/
        // }).error(function (data, status, headers, config) {
        // });
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

    return ProjectFactory

}
angular.module('bioSpeak.projectHome')
    .factory('projService',['$http','$resource','ngAppConfig', projService])