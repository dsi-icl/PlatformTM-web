/**
 * Created by iemam on 15/10/2015.
 */

    'use strict'
    function fileService($http, $q, ngAppConfig) {
        var fileServiceFactory = {};
        var serviceBase = ngAppConfig.apiServiceBaseUri;
        console.log(serviceBase);

        var _getFiles = function (studyId) {

            return $http({
                url: serviceBase + 'api/files/study/'+studyId+'/uploadedFiles/',
                method: 'GET'
            }).then(
                function (response) {
                    return {
                        files: (response.data)
                    }
                }
            )
        };

        fileServiceFactory.getFiles = _getFiles;

        return fileServiceFactory
    }

angular.module('bioSpeak.DataStager')
    .factory('fileService',['$http','$q','ngAppConfig', fileService])

