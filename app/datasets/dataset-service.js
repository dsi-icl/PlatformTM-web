'use strict';

function datasetService($http, $q,ngAppConfig){

    var service = {}
    var serviceBase = ngAppConfig.apiServiceBaseUri;


    var tableHeaders;
    var DTdata;



    var _saveDataset = function(dataset){
        return $http({
            url: serviceBase + 'analysisdatasets/'+dataset.id,
            method: 'PUT',
            data: angular.toJson(dataset)
        }).then(
            function (response) {
                return response.status === 202;
            }
        );
    };

    var _deleteDataset = function(datasetId){
        return $http({
            url: serviceBase + 'analysisdatasets/'+datasetId+'/delete',
            method: 'GET',
        }).then(
            function (response) {
                return {
                    files: (response.data)
                }
            }
        )
    }

    var _getUserDatasets = function(){
        return $http({
            url: serviceBase + 'analysisdatasets/',
            method: 'GET'
        }).then(
            function(response){
                return response.data;
            }
        )
    };

    var _previewData = function(projectId, datasetId){
        var deferred = $q.defer();
        var userDataset = localStorageService.get('Dataset_'+datasetId)
        console.log('USERDATASET',userDataset);
        if(!userDataset)
            return deferred.promise
        var dataset = userDataset.dataset;


        $http.post(serviceBase + 'apps/exportwizard/projects/'+projectId+'/preview/',dataset)
            .success(function (response) {
                tableHeaders = response.header
                DTdata = response.data
                //console.log("Inside http get success",tableHeaders)
                deferred.resolve(tableHeaders);
            })
            .error(function (err, code) {
                deferred.reject(err);
                console.log(err, code);
            });
        return deferred.promise;
    }

    var _getDataTableData = function(){
        var deferred = $q.defer();
        deferred.resolve(DTdata);
        return deferred.promise;
    }

    var _requestFile = function(fileId){
        return  $http({
            method: 'GET',
            url: serviceBase + 'apps/export/files/' + fileId + '/export'
        }).then(function(response){
            return{outcome :(response.statusText)}
        });
    };

    var _checkFileStatus= function(fileId) {
        return $http({
            method: 'GET',
            url: serviceBase + 'apps/export/files/' + fileId + '/checkstatus'
        }).then(function(result){
            return result.data
        });
    };

    var _getFile = function(fileId) {
        return $http({
            url: serviceBase + 'apps/export/files/' + fileId + '/download',
            method: 'GET'
        }).then(
            function(response){
                var headers = response.headers();
                var data = response.data;
                //var filename;
                var contentType = headers['content-type'];
                var disposition = headers['content-disposition'];
                var filename = headers['x-filename'];
                //console.log(headers,contentType,disposition)

                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([data], { type: contentType });
                    var url = window.URL.createObjectURL(blob);

                    linkElement.setAttribute('href', url);
                    // if (disposition && disposition.indexOf('attachment') !== -1) {
                    //     var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    //     var matches = filenameRegex.exec(disposition);
                    //     if (matches != null && matches[1]) {
                    //         filename = matches[1].replace(/['"]/g, '');
                    //     }
                    // }
                    linkElement.setAttribute("download", filename);
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                    return {'url':url,'filename':filename};
                } catch (ex) {
                    console.log(ex);
                }
            }
        )
    };

    service.previewData = _previewData;
    service.getDataTableData = _getDataTableData;
    service.saveDataset = _saveDataset;
    service.getUserDatasets = _getUserDatasets;
    service.deleteDataset = _deleteDataset;
    service.requestFile = _requestFile;
    service.checkFileStatus = _checkFileStatus;
    service.getFile = _getFile;



    return service
}

angular
    .module('bioSpeak.datasets')
    .factory('datasetService',['$http', '$q','ngAppConfig', datasetService])