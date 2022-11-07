/**
 * Created by iemam on 19/02/2015.
 */

'use strict'
function ClinicalDataService($http, $q, localStorageService, ngAppConfig) {
    var serviceBase = ngAppConfig.apiServiceBaseUri;

    return {
        getObservations: function (projectId, observations) {
            return $http({
                url: serviceBase + 'apps/explore/projects/' + projectId + '/observations/clinical/search',
                method: 'POST',
                data: angular.toJson(observations)
            })
                .then(
                    function (response) {
                        return {
                            data: response.data.data,
                            keys: response.data.keys
                        }
                    },
                    function (httpError) {
                        // translate the error
                        throw httpError.status + " : " +
                        httpError.data;
                    });
        },

        getClinicalDataTree: function (projectId) {
            // var initData = localStorageService.get('ptm.explorer.'+projectId+'.clinical');
            // //if initData.timestamp < $scope.$parent.expVM.project.lastupdated
            // //then refresh from server
            // if(initData){
            //     return $q.when(true,function(){
            //         return initData
            //     })
            // }
            // else
            // {
            return $http({
                url: serviceBase + 'apps/explore/projects/' + projectId + '/observations/clinical/browse',
                method: 'GET',
                cache: true,
            }).then(function (response) {
                localStorageService.set('ptm.explorer.' + projectId + '.clinical', { treeData: (response.data) });
                return {
                    treeData: (response.data)
                }
            })
            // }


        },

        getGroupObsNode: function (projectId, obsRequests) {
            return $http({
                url: serviceBase + 'apps/explore/projects/' + projectId + '/observations/clinical/group',
                method: 'POST',
                data: angular.toJson(obsRequests)
            }).then(
                function (response) {
                    return response.data;
                }
            )
        },

        getObsQaulifiers: function (projectId, obsId, obsReq) {
            return $http({
                url: serviceBase + 'apps/explore/projects/' + projectId + '/observations/clinical/' + obsId + '/qualifiers',
                method: 'POST',
                data: angular.toJson(obsReq)
            }).then(
                function (response) {
                    return response.data;
                }
            )
        }
    }
}
angular.module('bioSpeak.datasets')
    .factory('clinicalDataService', ['$http', '$q', 'localStorageService', 'ngAppConfig', ClinicalDataService]);

