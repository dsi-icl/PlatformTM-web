/**
 * Created by iemam on 19/02/2015.
 */

'use strict'
function subjectDataService($http,ngAppConfig){
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return {
            getSubjData: function(projectId,characs) {
                //var domainCode = "VS"
                return $http({
                    // url:serviceBase+'api/projects/'+projectId+'/data/subjects/characteristics',
                    url:serviceBase+'apps/explore/projects/'+projectId+'/subjects/search',
                    method:'POST',
                    data: angular.toJson(characs)
                }).then(
                    function (response) {
                        return {
                            header: (response.data.header),
                            data: (response.data.data)
                        }
                    },
                    function (httpError) {
                        // translate the error
                        throw httpError.status + " : " +
                            httpError.data;
                    });
            },

            getSubjCharacteristics: function(projectId){
                    return $http({
                        //url:serviceBase+'api/projects/'+projectId+'/subjects/characteristics',
                        url:serviceBase+'apps/explore/projects/'+projectId+'/subjcharacteristics/browse',
                        method:'GET'
                    }).then(
                        function (response){
                            return {
                                SCs: (response.data)
                            }
                        }
                    )
            }
        }
    }

angular.module('biospeak.explorer')
    .factory('subjectDataService',['$http','ngAppConfig', subjectDataService])

