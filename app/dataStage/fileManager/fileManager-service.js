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

        var _getDirContent = function (projectId,dir) {
            console.log(!dir)
            //if(!dir) dir="top"

            dir = dir.replace("/","_")



            console.log(window.encodeURIComponent(serviceBase + 'api/files/project/'+projectId+'/uploadedFiles/'+dir));
            return $http({
                url: serviceBase + 'api/files/projects/'+projectId+'/uploadedFiles/'+dir,
                method: 'GET'
            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        };

        var _getDirectories= function (projectId) {

            return $http({
                url: serviceBase + 'api/files/projects/'+projectId+'/directories/',
                method: 'GET'
            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        };

        var _createDirectory= function (projectId,dirname) {
                console.log('inside service',dirname)

            return $http({
                url: serviceBase + 'api/files/projects/'+projectId+'/createdir/',
                method: 'POST',
                data: { name: dirname }

            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        };

        var _getDataTablePreview = function(fileId){
            console.log(fileId);
            var deferred = $q.defer();
            $http.get(serviceBase + 'api/files/'+fileId+'/preview/')
                .success(function (response) {
                    tableHeaders = response.header;
                    DTdata = response.data;
                    fileName = response.fileInfo;
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

        var _getFileInfo = function(){
            return fileName;
        }

        fileServiceFactory.getContent = _getDirContent;
        fileServiceFactory.getDirectories = _getDirectories;
        fileServiceFactory.createDirectory = _createDirectory;
        fileServiceFactory.getDataTablePreview = _getDataTablePreview;
        fileServiceFactory.getDataTableData = _getDataTableData;
        fileServiceFactory.getFileInfo = _getFileInfo;


        return fileServiceFactory
    }

angular.module('bioSpeak.DataStager')
    .factory('fileService',['$http','$q','ngAppConfig', fileService])

