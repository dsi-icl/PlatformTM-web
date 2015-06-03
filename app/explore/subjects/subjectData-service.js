/**
 * Created by iemam on 19/02/2015.
 */
angular.module('biospeak.subjects')

    .factory('subjectDataService',['$http','$q', function($http,$q) {
        return {
            getSubjData: function(studyId,characs) {
                //var domainCode = "VS"
                return $http({
                    url:'http://rachmaninoff.local:8080/api/studies/'+studyId+'/data/subjects/characteristics',
                    method:'POST',
                    data: angular.toJson(characs)
                }).then(
                    function (response) {
                        return {
                            scs: (response.data.scs),
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
                        url:'http://rachmaninoff.local:8080/api/projects/'+projectId+'/subjects/characteristics',
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

