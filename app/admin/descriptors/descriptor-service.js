/**
 * Created by iemam on 22/07/2014.
 */

'use strict'

function DescriptorService($resource, $http,ngAppConfig) {
    var DescriptorServiceFactory = {};
    var serviceBase = ngAppConfig.apiServiceBaseUri;


    var _descriptorResource = $resource(serviceBase+'descriptors/:descriptorId',{},{
        save: {
            method: 'POST',
            params: {projectId: '@id'}
        },
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
        },
        getDescriptor: {
            method: 'GET',
            params: {descriptorId: '@descriptorId'},
            isArray: false
        }

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

    var _saveDescriptor = function(dd,projectId){
        return $http({
            url: serviceBase + 'descriptors/',
            method: 'POST',
            params:{projectId: projectId},
            data: angular.toJson(dd)
        }).then(
            function (response) {
                return response.status === 202;
            }
        );
    }

    DescriptorServiceFactory.getDDescriptorResource = _descriptorResource;

    DescriptorServiceFactory.load = _loadUploadedDescriptor;
    DescriptorServiceFactory.saveDescriptor = _saveDescriptor;
    return DescriptorServiceFactory
}


angular.module('bioSpeak.config')
    .factory('DescriptorService',['$resource','$http','ngAppConfig', DescriptorService])
