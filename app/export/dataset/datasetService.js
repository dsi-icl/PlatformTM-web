/**
 * Created by iemam on 15/09/2015.
 */
'use strict';

function datasetService($http, ngAppConfig,localStorageService){

    var exportFactory = {}
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    console.log(serviceBase);

    var _getDataFields = function(projectId){
        return $http({
            url: serviceBase + 'api/projects/'+projectId+'/datafields/',
            method: 'GET'
        }).then(
            function (response) {
                return {
                    fields: (response.data)

                }
            }
        );

        return fields
    }

    var _saveFields = function(user,fields){
        localStorageService.set('fieldData', {
            user: 'ibrahim',
            fields: fields
        });

    }

    exportFactory.getDataFields = _getDataFields;


    return exportFactory
}

angular
    .module('bioSpeak.export')
    .factory('datasetService',['$http', 'ngAppConfig','localStorageService', datasetService])



