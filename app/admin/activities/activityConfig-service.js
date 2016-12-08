/**
 * Created by iemam on 22/07/2014.
 */

'use strict'
function ActivityResource($resource, ngAppConfig) {
    var fileServiceFactory = {};
    var serviceBase = ngAppConfig.apiServiceBaseUri;
    console.log(serviceBase);
    return $resource(serviceBase+'activities/:activityId',{},{
        update:{
            method: 'PUT',
            params: {activityId: '@id'}
        },
        getActivitiesForProject:{
            method: 'GET',
            url : serviceBase+'projects/:projectId/activities',
            isArray : true
            /*params:{studyId}*/
        }
    });

}
angular.module('bioSpeak.config')
    .factory('ActivityResource',['$resource','ngAppConfig', ActivityResource])

/*angular.module('bioSpeak.config')

    .factory('ActivityResource',function($resource,ngAppConfig){
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return $resource(serviceBase+'activities/:activityId',{},{
            update:{
                method: 'PUT',
                params: {activityId: '@id'}
            },
            getActivitiesForStudy:{
                method: 'GET',
                url : serviceBase+'studies/:studyId/activities',
                isArray : true
                /!*params:{studyId}*!/
            }/!*,
            get:{
                method:'GET',
                url: 'http://rachmaninoff.local:8080/activities/:activityId'
            }*!/
       });
        /!*return $resource('../data/activities.json',{ }, {
            getData: {method:'GET', isArray: false}
        });*!/
    })*/


    .factory('AssayResource',function($resource,ngAppConfig){
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return $resource(serviceBase+'assays/:assayId',{},{
            update:{
                method: 'PUT',
                params: {assayId: '@id'}
            }/*,
            getActivitiesForStudy:{
                method: 'GET',
                url : serviceBase+'studies/:studyId/activities',
                isArray : true
                params:{studyId}
            },
             get:{
             method:'GET',
             url: 'http://rachmaninoff.local:8080/activities/:activityId'
             }*/
        });
        /*return $resource('../data/activities.json',{ }, {
         getData: {method:'GET', isArray: false}
         });*/
    })

/*    .factory('DatasetResource',function($resource){
        return $resource('/activities/:activityId/datasets',
            { 'query': { method: 'GET', isArray: false } })
    })*/

    .factory('DatasetResource',function($resource,ngAppConfig){
        var serviceBase = ngAppConfig.apiServiceBaseUri;
        return $resource(serviceBase+'templates/clinical/:datasetId',{},{
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
    })

    .factory('ISAconfigResource',function($resource){
        /*return $resource('/datasets/:datasetId')*/
        return $resource('../data/isaconfigs.json');
    })


    .service('model', function() {
        this.user = { name: 'bar'};

        this.activity = {};
        //this.dataset = {};
        this.isNewActivity = false
    })
