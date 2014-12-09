/**
 * Created by iemam on 22/07/2014.
 */
angular.module('eTRIKSdata.studyDesign')

    .factory('ActivityResource',function($resource){
       /* return $resource('/api/activities/:activityId', { activityId: '@_id'},{
        update:{
            method: 'PUT'
        }
       });*/
        return $resource('../data/activities.json',{ }, {
            getData: {method:'GET', isArray: false}
        });
    })

/*    .factory('DatasetResource',function($resource){
        return $resource('/api/activities/:activityId/datasets',
            { 'query': { method: 'GET', isArray: false } })
    })*/

    .factory('TemplateResource',function($resource){
        return $resource('http://rachmaninoff.local:8080/api/Dataset/:datasetId')
    })

    .factory('ISAconfigResource',function($resource){
        /*return $resource('/api/datasets/:datasetId')*/
        return $resource('../data/isaconfigs.json');
    })
