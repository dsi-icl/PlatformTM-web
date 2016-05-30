/**
 * Created by iemam on 22/07/2014.
 */
angular.module('bioSpeak.config')

    .factory('ActivityResource',function($resource,ngAppConfig){
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return $resource(serviceBase+'api/activities/:activityId',{},{
            update:{
                method: 'PUT',
                params: {activityId: '@id'}
            },
            getActivitiesForStudy:{
                method: 'GET',
                url : serviceBase+'api/studies/:studyId/activities',
                isArray : true
                /*params:{studyId}*/
            }/*,
            get:{
                method:'GET',
                url: 'http://rachmaninoff.local:8080/api/activities/:activityId'
            }*/
       });
        /*return $resource('../data/activities.json',{ }, {
            getData: {method:'GET', isArray: false}
        });*/
    })


    .factory('AssayResource',function($resource,ngAppConfig){
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return $resource(serviceBase+'api/assays/:assayId',{},{
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
    })

/*    .factory('DatasetResource',function($resource){
        return $resource('/api/activities/:activityId/datasets',
            { 'query': { method: 'GET', isArray: false } })
    })*/

    .factory('DatasetResource',function($resource,ngAppConfig){
        var serviceBase = ngAppConfig.apiServiceBaseUri;
        return $resource(serviceBase+'api/Dataset/:datasetId',{},{
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
                url : serviceBase+'api/activities/:activityId/datasets/:datasetId',
                isArray : false
                /*params:{studyId}*/
            }
        });
    })

    .factory('ISAconfigResource',function($resource){
        /*return $resource('/api/datasets/:datasetId')*/
        return $resource('../data/isaconfigs.json');
    })


    .service('model', function() {
        this.user = { name: 'bar'};

        this.activity = {};
        //this.dataset = {};
        this.isNewActivity = false
    })
