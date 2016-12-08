/**
 * Created by iemam on 19/02/2015.
 */

'use strict'
function ClinicalDataService($http,$q,ngAppConfig){
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return {
            getObservations: function(projectId,observations) {
                return $http({
                    // url:serviceBase+'api/projects/'+projectId+'/data/clinical/observations',
                    url:serviceBase+'api/apps/explore/projects/'+projectId+'/observations/clinical/search',
                    method:'POST',
                    data: angular.toJson(observations)
                })
                    .then(
                    function (response) {
                        return {
                            findingsTbl: (response.data.findingsTbl),
                            eventsTbl: (response.data.eventsTbl),
                            findingsTblHeader: (response.data.findingsTblHeader),
                            eventsTblHeader: (response.data.eventsTblHeader)
                        }
                    },
                    function (httpError) {
                        // translate the error
                        throw httpError.status + " : " +
                            httpError.data;
                    });
            },

            getClinicalDataTree: function(projectId){
                return $http({
                    url: serviceBase+'api/apps/explore/projects/'+projectId+'/observations/clinical/browse',
                    method:'GET',
                    cache: true,
                }).then(
                        function (response){
                            return {
                                treeData: (response.data)
                            }
                        }
                    )
            },

            getGroupObsNode: function(projectId,obsRequests){
                return $http({
                    url: serviceBase+'api/apps/explore/projects/'+projectId+'/observations/clinical/group',
                    method:'POST',
                    data:angular.toJson(obsRequests)
                }).then(
                    function (response){
                        return response.data;

                    }
                )
            }
        }
    }
angular.module('biospeak.explorer')
    .factory('clinicalDataService',['$http','$q','ngAppConfig', ClinicalDataService]);

