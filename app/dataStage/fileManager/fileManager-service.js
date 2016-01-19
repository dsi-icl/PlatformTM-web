/**
 * Created by iemam on 15/10/2015.
 */

    'use strict'
    function fileService($http, $q, ngAppConfig) {
        var fileServiceFactory = {};
        var serviceBase = ngAppConfig.apiServiceBaseUri;
        console.log(serviceBase);

        var _getDirContent = function (projectId,dir) {
            if(dir=='')dir="top"
            return $http({
                url: serviceBase + 'api/files/project/'+projectId+'/uploadedFiles/'+dir,
                method: 'GET'
            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        };

        var _getDirectories= function (studyId) {

            return $http({
                url: serviceBase + 'api/files/project/'+studyId+'/directories/',
                method: 'GET'
            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        };

        var _createDirectory= function (studyId,dirname) {
                console.log('inside service',dirname)
            /*$http.post(serviceBase + 'api/files/project/'+studyId+'/createdir/',dirname)
                .then(function (response) {
                    console.log("Inside http get success",response)
                    return {
                        files: (response.data)
                    }
                })*/
            return $http({
                url: serviceBase + 'api/files/project/'+studyId+'/createdir/',
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

        fileServiceFactory.getContent = _getDirContent;
        fileServiceFactory.getDirectories = _getDirectories;
        fileServiceFactory.createDirectory = _createDirectory;



        return fileServiceFactory
    }

angular.module('bioSpeak.DataStager')
    .factory('fileService',['$http','$q','ngAppConfig', fileService])

