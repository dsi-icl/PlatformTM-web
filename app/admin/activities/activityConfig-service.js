/**
 * Created by iemam on 22/07/2014.
 */

'use strict'

function ActivityConfigService($resource, ngAppConfig) {
    var activityConfigServiceFactory = {};
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    //console.log(serviceBase);

    var _activityResource = $resource(serviceBase+'activities/:activityId',{},{
        update:{
            method: 'PUT',
            params: {activityId: '@id'}
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

    activityConfigServiceFactory.getActivityResource = _activityResource;
    activityConfigServiceFactory.getDatasetResource = _datasetResource;

    return activityConfigServiceFactory
}


angular.module('bioSpeak.config')
    .factory('ActivityConfigService',['$resource','ngAppConfig', ActivityConfigService])
