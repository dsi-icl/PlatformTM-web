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

    .factory('datasetResource',function($resource){
        return $resource('/api/activities/:activityId/datasets')
    })

    .factory('datasetDefResource',function($resource){
        return $resource('/api/datasets/:datasetId')
    })

    .factory('datasetDefResource',function($resource){
        return $resource('/api/datasets/:datasetId/variables')
    });
