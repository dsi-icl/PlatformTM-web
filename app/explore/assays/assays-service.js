/**
 * Created by iemam on 19/02/2015.
 */

'use strict'
function assayDataService($http,$q,ngAppConfig){
     var serviceBase = ngAppConfig.apiServiceBaseUri;

     var assays;
    var ready = false;

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

            assaysRetrieved: function(){
                return assays;
            },

            getSampleData: function(projectId,assayId,reqChars) {
                if(!reqChars)
                    reqChars='';
                return $http({
                    url:serviceBase+'apps/explore/projects/'+projectId+'/assays/'+assayId+'/samples/search',
                    method:'POST',
                    data: angular.toJson(reqChars)
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
                        assays = response.data;
                        ready = true;

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

