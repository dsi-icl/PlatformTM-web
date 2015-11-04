/**
 * Created by iemam on 19/02/2015.
 */
angular.module('biospeak.subjects')

    .factory('subjectDataService',['$http','$q','ngAppConfig', function($http,$q,ngAppConfig) {
        var serviceBase = ngAppConfig.apiServiceBaseUri;

        return {
            getSubjData: function(studyId,characs) {
                //var domainCode = "VS"
                return $http({
                    url:serviceBase+'api/studies/'+studyId+'/data/subjects/characteristics',
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
                        url:serviceBase+'api/projects/'+projectId+'/subjects/characteristics',
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
    }])

