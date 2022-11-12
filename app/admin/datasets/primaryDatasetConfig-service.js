/**
 * Created by iemam on 22/07/2014.
 */

'use strict'

function PrimaryDatasetConfigService($resource, ngAppConfig) {
    var primaryDatasetConfigServiceFactory = {};
    var serviceBase = ngAppConfig.apiServiceBaseUri;

    var _primaryDatasetResource = $resource(serviceBase+'projects/:projectId/datasets/:datasetId',{},{
        update:{
            method: 'PUT',
            params: {descriptorId: '@id'}
        }
    });

    var _datasetDescriptorResource = $resource(serviceBase+'projects/:projectId/descriptors',{},{
        query:{
            method: 'GET',
            isArray:true
        }
    });

    primaryDatasetConfigServiceFactory.getPrimaryDatasetResource = _primaryDatasetResource;
    primaryDatasetConfigServiceFactory.getDatasetDescriptorResource = _datasetDescriptorResource;

    return primaryDatasetConfigServiceFactory
}


angular.module('bioSpeak.config')
    .factory('PrimaryDatasetConfigService',['$resource','ngAppConfig', PrimaryDatasetConfigService])
