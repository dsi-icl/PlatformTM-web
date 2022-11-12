/**
 * Created by iemam on 18/05/2016.
 */

function AssayConfigService($http, $q, $resource, ngAppConfig) {
    var assayConfigServiceFactory = {};
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    console.log(serviceBase);

    var _getAssayTerms= function () {

        return $http({
            url: serviceBase + 'terms/assay/measurementTypes/',
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
            url: serviceBase + 'templates/assay/features',
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
            url: serviceBase + 'templates/assay/samples',
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
            url: serviceBase + 'templates/assay/data',
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

    var _assayResource =  $resource(serviceBase+'assays/:assayId',{},{
            update:{
                method: 'PUT',
                params: {assayId: '@id'}
            }
        });

    var _activityResource = $resource(serviceBase+'activities/:activityId',{},{
        update:{
            method: 'PUT',
            params: {activityId: '@id'}
        },
        getProjectActivities:{
            method: 'GET',
            url : serviceBase+'projects/:projectId/activities',
            isArray : true
        }
    });
    
    var _datasetResource = $resource(serviceBase+'templates/clinical/:datasetId',{},{
        update:{
            method: 'PUT',
            params: {datasetId: '@id'}
        },
        query:{
            method: 'GET',
            isArray:true
        },
        getDatasetForActivity:{
            method: 'GET',
            url : serviceBase+'activities/:activityId/datasets/:datasetId',
            isArray : false
            /*params:{studyId}*/
        }
    });

    assayConfigServiceFactory.getAssayTerms = _getAssayTerms;
    assayConfigServiceFactory.getAssayFeatureTemplates = _getAssayFeatureTemplates;
    assayConfigServiceFactory.getAssaySampleTemplates = _getAssaySampleTemplates;
    assayConfigServiceFactory.getAssayDataTemplates = _getAssayDataTemplates;
    assayConfigServiceFactory.getAssayResource = _assayResource;
    assayConfigServiceFactory.getActivityResource = _activityResource;
    assayConfigServiceFactory.getDatasetResource = _datasetResource;


    return assayConfigServiceFactory
}
angular.module('bioSpeak.config')
    .factory('AssayConfigService',['$http','$q','$resource','ngAppConfig', AssayConfigService])
