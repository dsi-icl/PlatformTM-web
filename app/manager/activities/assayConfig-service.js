/**
 * Created by iemam on 18/05/2016.
 */

function AssayConfigService($http, $q, $resource, ngAppConfig) {
    var assayConfigServiceFactory = {};
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    console.log(serviceBase);

    var _getAssayTerms= function () {

        return $http({
            url: serviceBase + 'api/terms/assay/measurementTypes/',
            method: 'GET'
        }).then(
            function (response) {
                return {
                    terms: (response.data)
                }
            }
        )
    };
    
    var _getAssayFeatureTemplates= function(){
        
        return $http({
            url: serviceBase + 'api/templates/assay/features',
            method: 'GET'
        }).then(
            function (response) {
                return {
                    templates: (response.data)
                }
            }
        )
    };

    var _getAssaySampleTemplates= function(){

        return $http({
            url: serviceBase + 'api/templates/assay/samples',
            method: 'GET'
        }).then(
            function (response) {
                console.log(response)
                return {
                    templates: (response.data)
                }
            }
        )
    };

    var _getAssayDataTemplates= function(){

        return $http({
            url: serviceBase + 'api/templates/assay/data',
            method: 'GET'
        }).then(
            function (response) {
                console.log(response)
                return {
                    templates: (response.data)
                }
            }
        )
    };

    var _assayResource =  $resource(serviceBase+'api/assays/:assayId',{},{
            update:{
                method: 'PUT',
                params: {assayId: '@id'}
            }/*,
             getActivitiesForStudy:{
             method: 'GET',
             url : serviceBase+'api/studies/:studyId/activities',
             isArray : true
             params:{studyId}
             },
             get:{
             method:'GET',
             url: 'http://rachmaninoff.local:8080/api/activities/:activityId'
             }*/
        });
        /*return $resource('../data/activities.json',{ }, {
         getData: {method:'GET', isArray: false}
         });*/
    


    assayConfigServiceFactory.getAssayTerms = _getAssayTerms;
    assayConfigServiceFactory.getAssayFeatureTemplates = _getAssayFeatureTemplates;
    assayConfigServiceFactory.getAssaySampleTemplates = _getAssaySampleTemplates;
    assayConfigServiceFactory.getAssayDataTemplates = _getAssayDataTemplates;
    assayConfigServiceFactory.getAssayResource = _assayResource;


    return assayConfigServiceFactory
}
angular.module('bioSpeak.config')
    .factory('AssayConfigService',['$http','$q','$resource','ngAppConfig', AssayConfigService])
