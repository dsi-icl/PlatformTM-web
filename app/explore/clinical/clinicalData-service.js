/**
 * Created by iemam on 19/02/2015.
 */
angular.module('biospeak.clinical')
    .factory('ClinicalDataResource',function($resource){

        //Get Datatree

        //Get DataToPlot

        /*return $resource('/api/datasets/:datasetId')*/
        return $resource('../data/domain-tree.json');
    })


    .factory('clinicalDataService',['$http','$q', function($http,$q) {

        return {
            getObservations: function(studyId,observations) {
                console.log(observations)

                return $http({
                    url:'http://rachmaninoff.local:8080/api/studies/'+studyId+'/data/clinical/observations',
                    //url:'http://rachmaninoff.local:8080/api/studies/'+studyId+'/data/clinical/'+domainCode+'/observations',
                    method:'POST',
                    data: angular.toJson(observations)
                })
                    .then(
                    function (response) {
                        return {
                            observations: (response.data)
                        }
                    },
                    function (httpError) {
                        // translate the error
                        throw httpError.status + " : " +
                            httpError.data;
                    });
            },

            getClinicalDataTree: function(studyId){
                return $http({
                    url:'http://rachmaninoff.local:8080/api/DataVisulaiser/'+studyId,
                    method:'GET'
                }).then(
                        function (response){
                            return {
                                treeData: (response.data)
                            }
                        }
                    )
            }
        }
    }])

