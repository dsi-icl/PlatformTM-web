'use strict';

function datasetService($http, $q, $resource, ngAppConfig) {

    var service = {}
    var serviceBase = ngAppConfig.apiServiceBaseUri;


    var tableHeaders;
    var DTdata;

    var _projectDescriptors = $resource(serviceBase + 'projects/:projectId/descriptors', {}, {
        getAllProjectDescriptors: {
            method: 'GET',
            params: { projectId: '@id' },
            isArray: true
        }
    })

    var _descriptorViewResource = $resource(serviceBase + 'descriptors/:descriptorId/view', {}, {
        getDescriptorView: {
            method: 'GET',
            params: { descriptorId: '@id' },
            isArray: false
        }
    })

    var _primaryDatasetResource = $resource(serviceBase+'projects/:projectId/datasets/:datasetId',{},{
        update:{
            method: 'PUT',
            params: {descriptorId: '@id'}
        },
        getAllProjectDatasets: {
            method: 'GET',
            params: { projectId: '@id' },
            isArray: true
        }
    });

    var _getDescriptor = function (datasetId) {
        return $http({
            url: serviceBase + 'descriptors/' + datasetId,
            method: 'GET',
        }).then(
            function (response) {
                return {
                    files: (response.data)
                }
            }
        )
    }

    // added function
    var _getDataSet = function (datasetId) {
        return $http({
            url: serviceBase + 'datasets/' + datasetId,
            method: 'GET',
        }).then(
            function (response) {
                console.log(response.data)
                return {
                    files: (response.data)
                }
            }
        )
    }



    service.getProjectDescriptors = _projectDescriptors;
    service.getDescriptorResource = _descriptorViewResource;
    service.getDescriptor = _getDescriptor;
    service.getDataSet = _getDataSet;
    service.getPrimaryDatasetResource = _primaryDatasetResource;





    return service
}

angular
    .module('bioSpeak.datasets')
    .factory('datasetService', ['$http', '$q', '$resource', 'ngAppConfig', datasetService])