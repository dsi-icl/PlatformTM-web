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



            console.log(window.encodeURIComponent(serviceBase + 'files/project/'+projectId+'/uploadedFiles/'+dir));
            return $http({
                url: serviceBase + 'files/projects/'+projectId+'/uploadedFiles/'+dir,
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
                url: serviceBase + 'files/projects/'+projectId+'/directories/',
                method: 'GET'
            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        };


        //added part start********************************************************
        // In the following ".then" part works on the response of the c#. it puts the response in the "data"
        var _deleteFile = function(fileId){
            console.log("fileManager-service part is WORKING- and the file with following ID will be deleted",fileId);
            return $http({
                // url: serviceBase + 'api/files/remove/'+fileId +'/',
                // serviceBase = http://ehs.biospeak.solutions/sandbox/

                //the following is added as we use the local host to test
                url: 'http://localhost:2483/files/remove/'+fileId,
                method: 'GET',
                //data: { name: dirname }
                //Do we actually need "Then" because it's a void type and the back-end doesn't return anything????!!!!!!!!
                // possible answer is that, in this case since we don not get anything returned from c# the "data" would be an empty object
            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        }
        //added part finish********************************************************
        var _createDirectory= function (projectId,dirname) {
                console.log('inside service',dirname)

            return $http({
                url: serviceBase + 'files/projects/'+projectId+'/createdir/',
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
            $http.get(serviceBase + 'files/'+fileId+'/preview/')
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
        fileServiceFactory.deleteFile = _deleteFile;


        return fileServiceFactory
    }

angular.module('bioSpeak.DataStager')
    .factory('fileService',['$http','$q','ngAppConfig', fileService])

