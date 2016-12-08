/**
 * Created by iemam on 19/02/2015.
 */

'use strict'
function assayDataService($http,$q,ngAppConfig){
     var serviceBase = ngAppConfig.apiServiceBaseUri;

        return {
            getSubjData: function(projectId,characs) {
                //var domainCode = "VS"
                return $http({
                    url:serviceBase+'projects/'+projectId+'/data/assays/characteristics',
                    method:'POST',
                    data: angular.toJson(characs)
                }).then(
                    function (response) {
                        return {
                            scs: (response.data)
                        }
                    },
                    function (httpError) {
                        // translate the error
                        throw httpError.status + " : " +
                        httpError.data;
                    });
            },

            getSubjCharacteristics: function(projectId){

            },

            getSampleData: function(projectId,assayId,reqObs) {
                //console.log(angular.toJson(observations))
                return $http({
                    url:serviceBase+'assays/'+assayId+'/samples',
                    method:'GET'//,
                    //data: angular.toJson(observations)
                }).then(
                    function (response) {
                        return {
                            data: (response.data.data),
                            //eventsTbl: (response.data.eventsTbl),
                            header: (response.data.header)
                            //eventsTblHeader: (response.data.eventsTblHeader)
                        }
                    },
                    function (httpError) {
                        // translate the error
                        throw httpError.status + " : " +
                        httpError.data;
                    }
                );
            },

            getAssays: function(projectId){
                return $http({
                    url:serviceBase+'apps/explore/projects/'+projectId+'/assays/browse',
                    method:'GET'//,
                    //data: angular.toJson(observations)
                }).then(
                    function (response) {
                        return {
                            assays: (response.data)
                        }
                    },
                    function (httpError) {
                        // translate the error
                        throw httpError.status + " : " +
                        httpError.data;
                    }
                );

            }


        }
    }

angular.module('biospeak.explorer')
    .factory('assayDataService',['$http','$q','ngAppConfig', assayDataService])

