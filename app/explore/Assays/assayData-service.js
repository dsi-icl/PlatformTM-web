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


                getSampleData: function(studyId) {
                    //console.log(angular.toJson(observations))

                    return $http({
                        url:serviceBase+'api/projects/'+studyId+'/data/samples',
                        method:'GET'//,
                        //data: angular.toJson(observations)
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
                }


        }
    }])

