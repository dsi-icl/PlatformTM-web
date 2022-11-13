/**
 * Created by iemam on 15/10/2015.
 */

    'use strict'
    function fileService($http, $q, ngAppConfig) {
        var fileServiceFactory = {};
        var serviceBase = ngAppConfig.apiServiceBaseUri;
        console.log(serviceBase);

        var tableHeaders;
        var DTdata;
        var fileName;

        var _getDirContent = function (projectId,dirId) {
            return $http({
                url: serviceBase + 'file-management/projects/'+projectId+'/drive/'+dirId,
                method: 'GET'
            }).then(
                function (response) {
                    return response.data
                }
            )
        };

        var _getDirectories= function (projectId) {

            return $http({
                url: serviceBase + 'file-management/projects/'+projectId+'/drive/folders/',
                method: 'GET'
            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        };

        var _downloadFile = function(fileId) {

            $http({
                method: 'GET',
                url: serviceBase + 'file-management/files/' + fileId+'/download'
                //params: {fileId: fileId},
                //responseType: ''
            }).success(function (data, status, headers) {

                headers = headers();
                //console.log("header is",headers)
                var fileName = headers['x-filename'];
                var file = new Blob([data], {type: headers['content-type']});
                var fileURL = URL.createObjectURL(file);
                var a = document.createElement('a');
                a.href = fileURL;
                a.target = '_blank';
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
            }).error(function (data, status, headers, config) {
            });
        };

        var _createDirectory= function (projectId,folder) {
            return $http({
                url: serviceBase + 'file-management/projects/'+projectId+'/drive/folders',
                method: 'POST',
                data: angular.toJson(folder)

            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        };

        var _deleteFile = function(fileId){
            return $http({
                url: serviceBase + 'file-management/files/'+fileId+'/remove',
                method: 'GET',
            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        };

        var _unloadFile = function(fileId){
            return $http({
                url: serviceBase + 'files/'+fileId+'/unload',
                method: 'GET',
            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        }

        var _getDataTablePreview = function(fileId){
            // console.log(fileId);
            var deferred = $q.defer();
            $http.get(serviceBase + 'file-management/files/'+fileId+'/preview/')
                .success(function (response) {
                    var dtColumns = [];
                    response.data.columns.forEach(function(col){
                        var dtColumn = {}
                        dtColumn.data = col.columnName.toLowerCase();
                        dtColumn.title = col.columnName;
                        dtColumns.push(dtColumn);
                    });

                    tableHeaders = dtColumns;
                    DTdata = response.data.rows;
                    fileName = response.data.tableName;

                    var result = {data:response.data,
                                  file: response.file,
                                    folders: response.folders,
                        tableHeader: dtColumns}

                    deferred.resolve(result);
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

        var _getFileInfo = function(){
            return fileName;
        }

        fileServiceFactory.getContent = _getDirContent;
        fileServiceFactory.getDirectories = _getDirectories;
        fileServiceFactory.createDirectory = _createDirectory;
        fileServiceFactory.getDataTablePreview = _getDataTablePreview;
        fileServiceFactory.getDataTableData = _getDataTableData;
        fileServiceFactory.getFileInfo = _getFileInfo;
        fileServiceFactory.deleteFile = _deleteFile;
        fileServiceFactory.unloadFile = _unloadFile;
        fileServiceFactory.downloadFile = _downloadFile


        return fileServiceFactory
    }

angular.module('bioSpeak.DataStager')
    .factory('fileService',['$http','$q','ngAppConfig', fileService])

