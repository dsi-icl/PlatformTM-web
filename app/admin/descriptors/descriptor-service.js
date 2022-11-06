/**
 * Created by iemam on 22/07/2014.
 */

'use strict'

function DescriptorService($resource, $http,ngAppConfig) {
    var DescriptorServiceFactory = {};
    var serviceBase = ngAppConfig.apiServiceBaseUri;


    var _activityResource = $resource(serviceBase+'activities/:activityId',{},{
        update:{
            method: 'PUT',
            params: {activityId: '@id'}
        }
    });

    var _descriptorResource = $resource(serviceBase+'descriptors/:descriptorId',{},{
        update:{
            method: 'PUT',
            params: {descriptorId: '@id'}
        },
        query:{
            method: 'GET',
            isArray:true
         },
        loadUploadedDescriptor:{
                method: 'GET',
                url : serviceBase+'descriptors/:descriptorId'
        }
        // getDatasetForActivity:{
        //     method: 'GET',
        //     url : serviceBase+'activities/:activityId/datasets/:datasetId',
        //     isArray : false
        //     /*params:{studyId}*/

    });


    var _loadUploadedDescriptor = function(projectId,filename){
        return $http({
            url: serviceBase + 'descriptors/load/' + filename+'/projects/'+projectId,
            method: 'GET'
        }).then(
            function(response){
                return response.data;
            }
        )
    }

    //DescriptorServiceFactory.getActivityResource = _activityResource;
    DescriptorServiceFactory.getDatasetResource = _descriptorResource;

    DescriptorServiceFactory.load = _loadUploadedDescriptor;
    return DescriptorServiceFactory
}


angular.module('bioSpeak.config')
    .factory('DescriptorService',['$resource','$http','ngAppConfig', DescriptorService])
