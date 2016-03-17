/**
 * Created by iemam on 19/02/2015.
 */
angular.module('biospeak.assays')

    .factory('assayDataService',['$http','$q','ngAppConfig', function($http,$q,ngAppConfig) {
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return {
            getSubjData: function(studyId,characs) {
                //var domainCode = "VS"
                return $http({
                    url:serviceBase+'api/studies/'+studyId+'/data/assays/characteristics',
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

            getSubjCharacteristics: function(studyId){

            },


            getSampleData: function(studyId,assayId,reqObs) {
                //console.log(angular.toJson(observations))
                return $http({
                    url:serviceBase+'api/projects/'+studyId+'/assays/'+assayId+'/samples',
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

            getAssays: function(studyId){
                return $http({
                    url:serviceBase+'api/projects/'+studyId+'/assays',
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
    }])

