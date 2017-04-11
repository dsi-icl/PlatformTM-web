/**
 * Created by iemam on 19/02/2015.
 */

'use strict'
function subjectDataService($http,ngAppConfig){
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return {
            getSubjData: function(projectId,characs) {

                if(!characs)
                    characs='';

                return $http({
                    // url:serviceBase+'api/projects/'+projectId+'/data/subjects/characteristics',
                    url:serviceBase+'apps/explore/projects/'+projectId+'/subjects/search',
                    method:'POST',
                    data: angular.toJson(characs)
                }).then(
                    function (response) {
                        var columns = [];
                        response.data.columns.forEach(function(col){
                            columns.push(col.columnName);
                        });
                        return {
                            data: (response.data.rows),
                            header: columns
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
                            //console.log(response);
                            return {
                                SCs: response.data.characteristics,
                                TPs: response.data.timings,
                                DEs: response.data.designElements
                            }
                        }
                    )
            }
        }
    }

angular.module('biospeak.explorer')
    .factory('subjectDataService',['$http','ngAppConfig', subjectDataService])

